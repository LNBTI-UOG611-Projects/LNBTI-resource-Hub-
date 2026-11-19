import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sameOriginFailure } from "../../../../lib/auth/authorization.js";
import {
  PRIVILEGED_REGISTRATION_ROLES,
  PUBLIC_REGISTRATION_ROLES,
  STUDENT_ROLE_NAME,
} from "../../../../lib/auth/roles.js";
import { prisma } from "../../../../lib/prisma.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]{7,30}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,72}$/;

export async function POST(request) {
  const originError = sameOriginFailure(request);
  if (originError) return originError;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Registration request is too large." }, { status: 413 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword = typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";
  const roleName = typeof payload.role === "string" ? payload.role : "";

  if (!fullName || fullName.length > 150) {
    return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (!emailPattern.test(email) || email.length > 255) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!phonePattern.test(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }
  if (!passwordPattern.test(password) || Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json(
      { error: "Use 10-72 characters with uppercase, lowercase, a number, and a symbol." },
      { status: 400 },
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }
  if (payload.termsAccepted !== true) {
    return NextResponse.json({ error: "Accept the Terms and Conditions to continue." }, { status: 400 });
  }
  if (!PUBLIC_REGISTRATION_ROLES.includes(roleName)) {
    return NextResponse.json({ error: "Select an available registration role." }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (existingUser) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    if (roleName === STUDENT_ROLE_NAME) {
      await prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          passwordHash,
          status: "ACTIVE",
          userRoles: {
            create: {
              role: { connect: { name: STUDENT_ROLE_NAME } },
            },
          },
        },
      });

      return NextResponse.json({ message: "Registration successful. You can now sign in." }, { status: 201 });
    }

    if (PRIVILEGED_REGISTRATION_ROLES.includes(roleName)) {
      await prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          passwordHash,
          status: "INACTIVE",
          roleApprovalRequest: {
            create: {
              requestedRole: { connect: { name: roleName } },
            },
          },
        },
      });

      return NextResponse.json(
        { message: "Your registration has been submitted successfully. Your account is pending approval by the System Administrator." },
        { status: 202 },
      );
    }

    return NextResponse.json({ error: "Select an available registration role." }, { status: 400 });
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
    }
    console.error("Registration request failed.", { code: error?.code ?? "UNKNOWN" });
    return NextResponse.json({ error: "Registration could not be completed. Please try again." }, { status: 500 });
  }
}