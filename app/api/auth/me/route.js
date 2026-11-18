import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth/session.js";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    return NextResponse.json({
      user: { fullName: user.fullName, email: user.email, roles: user.roles },
    });
  } catch {
    return NextResponse.json({ error: "Unable to verify the current session." }, { status: 500 });
  }
}