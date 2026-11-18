import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "../../../../lib/auth/session.js";
import { getRoleNames } from "../../../../lib/auth/roles.js";
import { prisma } from "../../../../lib/prisma.js";

export async function POST(request) {
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
  if (!email || !password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        roles: getRoleNames(user.userRoles),
      },
      redirectTo: "/dashboard",
    });
  } catch {
    return NextResponse.json({ error: "Sign in is temporarily unavailable." }, { status: 500 });
  }
}