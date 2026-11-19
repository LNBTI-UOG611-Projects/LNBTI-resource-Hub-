import { NextResponse } from "next/server";
import { requireSystemManager, sameOriginFailure } from "../../../../../../lib/auth/authorization.js";
import { prisma } from "../../../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

const MAX_BIGINT = 9_223_372_036_854_775_807n;

function parseRequestId(value) {
  if (typeof value !== "string" || !/^[1-9]\d{0,18}$/.test(value)) return null;
  const id = BigInt(value);
  return id <= MAX_BIGINT ? id : null;
}

export async function POST(request, context) {
  const originError = sameOriginFailure(request);
  if (originError) return originError;

  try {
    const { user, response } = await requireSystemManager();
    if (response) return response;

    const { requestId: requestIdParam } = await context.params;
    const requestId = parseRequestId(requestIdParam);
    if (requestId === null) {
      return NextResponse.json({ error: "Invalid approval request." }, { status: 400 });
    }

    const reviewerId = BigInt(user.id);
    const outcome = await prisma.$transaction(async (transaction) => {
      const approval = await transaction.roleApprovalRequest.findUnique({
        where: { id: requestId },
        select: { id: true, userId: true, requestedRoleId: true, status: true },
      });

      if (!approval) return "NOT_FOUND";
      if (approval.userId === reviewerId) return "SELF_APPROVAL";
      if (approval.status !== "PENDING") return "NOT_PENDING";

      const reviewedAt = new Date();
      const claimed = await transaction.roleApprovalRequest.updateMany({
        where: { id: requestId, status: "PENDING" },
        data: { status: "APPROVED", reviewerId, reviewedAt },
      });
      if (claimed.count !== 1) return "NOT_PENDING";

      const activated = await transaction.user.updateMany({
        where: { id: approval.userId, status: "INACTIVE" },
        data: { status: "ACTIVE" },
      });
      if (activated.count !== 1) {
        const error = new Error("Approval applicant state changed.");
        error.code = "APPROVAL_STATE_CONFLICT";
        throw error;
      }

      await transaction.userRole.create({
        data: {
          userId: approval.userId,
          roleId: approval.requestedRoleId,
          assignedBy: reviewerId,
        },
      });
      return "APPROVED";
    }, { maxWait: 5_000, timeout: 10_000 });

    if (outcome === "NOT_FOUND") {
      return NextResponse.json({ error: "Approval request not found." }, { status: 404 });
    }
    if (outcome === "SELF_APPROVAL") {
      return NextResponse.json({ error: "You cannot approve your own request." }, { status: 403 });
    }
    if (outcome === "NOT_PENDING") {
      return NextResponse.json({ error: "This request is no longer pending." }, { status: 409 });
    }

    return NextResponse.json({ message: "Role approval completed." });
  } catch (error) {
    if (error?.code === "APPROVAL_STATE_CONFLICT" || error?.code === "P2002") {
      return NextResponse.json({ error: "This request could not be approved because its state has changed." }, { status: 409 });
    }
    console.error("Role approval failed.", { code: error?.code ?? "UNKNOWN" });
    return NextResponse.json({ error: "Role approval is temporarily unavailable." }, { status: 500 });
  }
}
