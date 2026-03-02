import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchThreads } from "@/lib/gmail";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || undefined;
        const category = searchParams.get("category") || "primary";
        const pageToken = searchParams.get("pageToken") || undefined;
        const maxResults = parseInt(searchParams.get("maxResults") || "20");

        // Map category to Gmail labels/query
        let labelIds: string[] | undefined;
        let gmailQuery = query || undefined;

        switch (category) {
            case "starred":
                labelIds = ["STARRED"];
                break;
            case "sent":
                labelIds = ["SENT"];
                break;
            case "drafts":
                labelIds = ["DRAFT"];
                break;
            case "trash":
                labelIds = ["TRASH"];
                break;
            case "archive":
                // Archived = not in INBOX, not in TRASH, not in SPAM
                gmailQuery = gmailQuery
                    ? `${gmailQuery} -in:inbox -in:trash -in:spam`
                    : "-in:inbox -in:trash -in:spam";
                break;
            case "updates":
                labelIds = ["CATEGORY_UPDATES"];
                break;
            case "social":
                labelIds = ["CATEGORY_SOCIAL"];
                break;
            case "promotions":
                labelIds = ["CATEGORY_PROMOTIONS"];
                break;
            case "forums":
                labelIds = ["CATEGORY_FORUMS"];
                break;
            case "primary":
            default:
                labelIds = ["INBOX"];
                break;
        }

        const result = await fetchThreads(session.user.id, {
            maxResults,
            query: gmailQuery,
            pageToken,
            labelIds,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Email fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch emails" },
            { status: 500 }
        );
    }
}
