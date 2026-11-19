import { NextResponse } from "next/server";
import { requireSystemManager } from "../../../../lib/auth/authorization.js";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { response } = await requireSystemManager();
    if (response) return response;

    const pendingRequests = await prisma.roleApprovalRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        status: true,
        createdAt: true,
        requestedRole: { select: { name: true } },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      requests: pendingRequests.map((item) => ({
        id: item.id.toString(),
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        requestedRole: item.requestedRole.name,
        applicant: {
          id: item.user.id.toString(),
          fullName: item.user.fullName,
          email: item.user.email,
          phone: item.user.phone,
          status: item.user.status,
        },
      })),
    });
  } catch (error) {
    console.error("Approval list request failed.", { code: error?.code ?? "UNKNOWN" });
    return NextResponse.json({ error: "Approval requests are temporarily unavailable." }, { status: 500 });
  }
}
