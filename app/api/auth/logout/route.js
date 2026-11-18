import { NextResponse } from "next/server";
import { revokeCurrentSession } from "../../../../lib/auth/session.js";

export async function POST() {
  try {
    await revokeCurrentSession();
    return NextResponse.json({ message: "Signed out." });
  } catch {
    return NextResponse.json({ error: "Sign out could not be completed." }, { status: 500 });
  }
}