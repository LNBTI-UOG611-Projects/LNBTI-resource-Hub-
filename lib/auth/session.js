import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "../prisma.js";
import { getRoleNames } from "./roles.js";

export const SESSION_COOKIE = "campusflow_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function cookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, cookieOptions());
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: {
        include: {
          userRoles: { include: { role: true } },
        },
      },
    },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    session.user.status !== "ACTIVE"
  ) {
    return null;
  }

  return {
    id: session.user.id.toString(),
    fullName: session.user.fullName,
    email: session.user.email,
    roles: getRoleNames(session.user.userRoles),
    sessionId: session.id,
  };
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  try {
    if (token) {
      await prisma.authSession.updateMany({
        where: {
          tokenHash: hashSessionToken(token),
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    }
  } finally {
    cookieStore.set(SESSION_COOKIE, "", cookieOptions(0));
  }
}