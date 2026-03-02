import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { trashThread, modifyThread, toggleStar } from "@/lib/gmail";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { threadId } = await params;
        const body = await request.json();
        const { action, starred } = body;

        switch (action) {
            case "trash":
                await trashThread(session.user.id, threadId);
                break;
            case "archive":
                await modifyThread(session.user.id, threadId, {
                    removeLabelIds: ["INBOX"],
                });
                break;
            case "star":
                await toggleStar(session.user.id, threadId, starred);
                break;
            case "markRead":
                await modifyThread(session.user.id, threadId, {
                    removeLabelIds: ["UNREAD"],
                });
                break;
            case "markUnread":
                await modifyThread(session.user.id, threadId, {
                    addLabelIds: ["UNREAD"],
                });
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Thread action error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to perform action" },
            { status: 500 }
        );
    }
}
