import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]{7,30}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,72}$/;
const STUDENT_ROLE_NAME = "Student";

export async function POST(request) {
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

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        userRoles: {
          create: {
            role: { connect: { name: STUDENT_ROLE_NAME } },
          },
        },
      },
    });

    return NextResponse.json({ message: "Registration successful. You can now sign in." }, { status: 201 });
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