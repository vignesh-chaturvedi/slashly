import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { smartSearch } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }

        const gmailQuery = await smartSearch(query);
        return NextResponse.json({ gmailQuery });
    } catch (error: any) {
        console.error("Smart search error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process search" },
            { status: 500 }
        );
    }
}
