import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sameOriginFailure } from "../../../../lib/auth/authorization.js";
import { createSession } from "../../../../lib/auth/session.js";
import {
  getRoleNames,
  SYSTEM_MANAGER_ROLE_NAME,
} from "../../../../lib/auth/roles.js";
import { prisma } from "../../../../lib/prisma.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const originError = sameOriginFailure(request);
  if (originError) return originError;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (!emailPattern.test(email) || email.length > 255 || !password || Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        fullName: true,
        email: true,
        passwordHash: true,
        status: true,
        userRoles: { select: { role: { select: { name: true } } } },
      },
    });

    if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);

    const roles = getRoleNames(user.userRoles);

    return NextResponse.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        roles,
      },
      redirectTo: roles.includes(SYSTEM_MANAGER_ROLE_NAME)
        ? "/admin"
        : "/dashboard",
    });
  } catch (error) {
    console.error("Sign-in request failed.", { code: error?.code ?? "UNKNOWN" });
    return NextResponse.json({ error: "Sign in is temporarily unavailable." }, { status: 500 });
  }
}