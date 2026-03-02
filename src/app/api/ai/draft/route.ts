import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateDraft } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { from, subject, emailBody, threadHistory } = body;

        if (!from || !subject || !emailBody) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const draft = await generateDraft({
            from,
            subject,
            body: emailBody,
            threadHistory,
        });

        return NextResponse.json({ draft });
    } catch (error: any) {
        console.error("AI draft error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate draft" },
            { status: 500 }
        );
    }
}
