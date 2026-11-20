import { NextResponse } from "next/server";
import { sameOriginFailure } from "../../../../lib/auth/authorization.js";
import { revokeCurrentSession } from "../../../../lib/auth/session.js";

export async function POST(request) {
  const originError = sameOriginFailure(request);
  if (originError) return originError;

  try {
    await revokeCurrentSession();
    return NextResponse.json({ message: "Signed out." });
  } catch {
    return NextResponse.json({ error: "Sign out could not be completed." }, { status: 500 });
  }
}