import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/gmail";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { to, cc, bcc, subject, content, threadId, inReplyTo, references } = body;

        if (!to?.length || !subject || !content) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject, content" },
                { status: 400 }
            );
        }

        const result = await sendEmail(session.user.id, {
            to,
            cc,
            bcc,
            subject,
            body: content,
            threadId,
            inReplyTo,
            references,
        });

        return NextResponse.json({ success: true, messageId: result.id });
    } catch (error: any) {
        console.error("Send email error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
