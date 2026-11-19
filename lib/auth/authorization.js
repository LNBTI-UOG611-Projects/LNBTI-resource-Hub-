import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "./session.js";
import { SYSTEM_MANAGER_ROLE_NAME } from "./roles.js";

export function sameOriginFailure(request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = request.nextUrl?.origin ?? new URL(request.url).origin;

  let requestOrigin;
  try {
    requestOrigin = origin ? new URL(origin).origin : "";
  } catch {
    requestOrigin = "";
  }

  if (!requestOrigin || requestOrigin !== expectedOrigin) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  return null;
}

export async function requireSystemManager() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  if (!user.roles.includes(SYSTEM_MANAGER_ROLE_NAME)) {
    return {
      user: null,
      response: NextResponse.json({ error: "System Manager access required." }, { status: 403 }),
    };
  }

  return { user, response: null };
}
