import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchThread, markAsRead } from "@/lib/gmail";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { threadId } = await params;
        const thread = await fetchThread(session.user.id, threadId);

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        // Mark as read
        try {
            await markAsRead(session.user.id, threadId);
        } catch (e) {
            // Non-critical, don't fail the request
        }

        return NextResponse.json(thread);
    } catch (error: any) {
        console.error("Thread fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch thread" },
            { status: 500 }
        );
    }
}
