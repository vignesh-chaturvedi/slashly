import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function getGmailClient(userId: string) {
    const account = await prisma.account.findFirst({
        where: { userId, provider: "google" },
    });

    if (!account?.access_token) {
        throw new Error("No Google account linked");
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
    });

    // Handle token refresh
    oauth2Client.on("tokens", async (tokens) => {
        if (tokens.access_token) {
            await prisma.account.update({
                where: { id: account.id },
                data: {
                    access_token: tokens.access_token,
                    expires_at: tokens.expiry_date
                        ? Math.floor(tokens.expiry_date / 1000)
                        : undefined,
                },
            });
        }
    });

    return google.gmail({ version: "v1", auth: oauth2Client });
}

export interface EmailThread {
    id: string;
    gmailId: string;
    subject: string;
    snippet: string;
    from: string;
    fromEmail: string;
    date: string;
    isRead: boolean;
    isStarred: boolean;
    category: string;
    messageCount: number;
    messages: EmailMessage[];
}

export interface EmailMessage {
    id: string;
    gmailId: string;
    from: string;
    fromEmail: string;
    to: string[];
    cc: string[];
    subject: string;
    bodyHtml: string;
    bodyText: string;
    date: string;
    isRead: boolean;
}

function parseEmailAddress(header: string): { name: string; email: string } {
    const match = header.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
        return { name: match[1].replace(/"/g, "").trim(), email: match[2] };
    }
    return { name: header, email: header };
}

function getHeader(
    headers: Array<{ name?: string | null; value?: string | null }>,
    name: string
): string {
    const header = headers.find(
        (h) => h.name?.toLowerCase() === name.toLowerCase()
    );
    return header?.value || "";
}

function decodeBase64(data: string): string {
    try {
        return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
    } catch {
        return "";
    }
}

function extractBody(payload: any): { html: string; text: string } {
    let html = "";
    let text = "";

    if (payload.body?.data) {
        const decoded = decodeBase64(payload.body.data);
        if (payload.mimeType === "text/html") {
            html = decoded;
        } else {
            text = decoded;
        }
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === "text/html" && part.body?.data) {
                html = decodeBase64(part.body.data);
            } else if (part.mimeType === "text/plain" && part.body?.data) {
                text = decodeBase64(part.body.data);
            } else if (part.parts) {
                const nested = extractBody(part);
                if (nested.html) html = nested.html;
                if (nested.text) text = nested.text;
            }
        }
    }

    return { html, text };
}

export async function fetchThreads(
    userId: string,
    options: { maxResults?: number; query?: string; pageToken?: string; labelIds?: string[] } = {}
) {
    const gmail = await getGmailClient(userId);
    const { maxResults = 20, query, pageToken, labelIds } = options;

    const response = await gmail.users.threads.list({
        userId: "me",
        maxResults,
        q: query,
        pageToken,
        labelIds,
    });

    const threads: EmailThread[] = [];

    if (response.data.threads) {
        for (const thread of response.data.threads) {
            try {
                const threadData = await gmail.users.threads.get({
                    userId: "me",
                    id: thread.id!,
                    format: "full",
                });

                const messages = threadData.data.messages || [];
                const firstMessage = messages[0];
                const lastMessage = messages[messages.length - 1];
                const headers = firstMessage?.payload?.headers || [];
                const lastHeaders = lastMessage?.payload?.headers || [];

                const fromHeader = getHeader(headers, "From");
                const { name: fromName, email: fromEmail } = parseEmailAddress(fromHeader);

                const labelIds = firstMessage?.labelIds || [];
                const isRead = !labelIds.includes("UNREAD");
                const isStarred = labelIds.includes("STARRED");

                let category = "primary";
                if (labelIds.includes("CATEGORY_UPDATES")) category = "updates";
                else if (labelIds.includes("CATEGORY_SOCIAL")) category = "social";
                else if (labelIds.includes("CATEGORY_PROMOTIONS")) category = "promotions";
                else if (labelIds.includes("CATEGORY_FORUMS")) category = "forums";

                const emailMessages: EmailMessage[] = messages.map((msg) => {
                    const msgHeaders = msg.payload?.headers || [];
                    const msgFrom = getHeader(msgHeaders, "From");
                    const { name: msgFromName, email: msgFromEmail } = parseEmailAddress(msgFrom);
                    const body = extractBody(msg.payload);

                    return {
                        id: msg.id || "",
                        gmailId: msg.id || "",
                        from: msgFromName,
                        fromEmail: msgFromEmail,
                        to: getHeader(msgHeaders, "To").split(",").map((t) => t.trim()),
                        cc: getHeader(msgHeaders, "Cc")
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        subject: getHeader(msgHeaders, "Subject"),
                        bodyHtml: body.html,
                        bodyText: body.text,
                        date: getHeader(msgHeaders, "Date"),
                        isRead: !(msg.labelIds || []).includes("UNREAD"),
                    };
                });

                threads.push({
                    id: thread.id!,
                    gmailId: thread.id!,
                    subject: getHeader(headers, "Subject"),
                    snippet: threadData.data.snippet || "",
                    from: fromName,
                    fromEmail,
                    date: getHeader(lastHeaders, "Date"),
                    isRead,
                    isStarred,
                    category,
                    messageCount: messages.length,
                    messages: emailMessages,
                });
            } catch (err) {
                console.error(`Error fetching thread ${thread.id}:`, err);
            }
        }
    }

    return {
        threads,
        nextPageToken: response.data.nextPageToken || null,
    };
}

export async function fetchThread(userId: string, threadId: string): Promise<EmailThread | null> {
    const gmail = await getGmailClient(userId);

    try {
        const threadData = await gmail.users.threads.get({
            userId: "me",
            id: threadId,
            format: "full",
        });

        const messages = threadData.data.messages || [];
        const firstMessage = messages[0];
        const lastMessage = messages[messages.length - 1];
        const headers = firstMessage?.payload?.headers || [];
        const lastHeaders = lastMessage?.payload?.headers || [];

        const fromHeader = getHeader(headers, "From");
        const { name: fromName, email: fromEmail } = parseEmailAddress(fromHeader);

        const labelIds = firstMessage?.labelIds || [];
        const isRead = !labelIds.includes("UNREAD");
        const isStarred = labelIds.includes("STARRED");

        let category = "primary";
        if (labelIds.includes("CATEGORY_UPDATES")) category = "updates";
        else if (labelIds.includes("CATEGORY_SOCIAL")) category = "social";
        else if (labelIds.includes("CATEGORY_PROMOTIONS")) category = "promotions";

        const emailMessages: EmailMessage[] = messages.map((msg) => {
            const msgHeaders = msg.payload?.headers || [];
            const msgFrom = getHeader(msgHeaders, "From");
            const { name: msgFromName, email: msgFromEmail } = parseEmailAddress(msgFrom);
            const body = extractBody(msg.payload);

            return {
                id: msg.id || "",
                gmailId: msg.id || "",
                from: msgFromName,
                fromEmail: msgFromEmail,
                to: getHeader(msgHeaders, "To").split(",").map((t) => t.trim()),
                cc: getHeader(msgHeaders, "Cc").split(",").map((t) => t.trim()).filter(Boolean),
                subject: getHeader(msgHeaders, "Subject"),
                bodyHtml: body.html,
                bodyText: body.text,
                date: getHeader(msgHeaders, "Date"),
                isRead: !(msg.labelIds || []).includes("UNREAD"),
            };
        });

        return {
            id: threadId,
            gmailId: threadId,
            subject: getHeader(headers, "Subject"),
            snippet: threadData.data.snippet || "",
            from: fromName,
            fromEmail,
            date: getHeader(lastHeaders, "Date"),
            isRead,
            isStarred,
            category,
            messageCount: messages.length,
            messages: emailMessages,
        };
    } catch (err) {
        console.error(`Error fetching thread ${threadId}:`, err);
        return null;
    }
}

export async function sendEmail(
    userId: string,
    options: {
        to: string[];
        cc?: string[];
        bcc?: string[];
        subject: string;
        body: string;
        threadId?: string;
        inReplyTo?: string;
        references?: string;
    }
) {
    const gmail = await getGmailClient(userId);

    const messageParts = [
        `To: ${options.to.join(", ")}`,
        options.cc?.length ? `Cc: ${options.cc.join(", ")}` : "",
        options.bcc?.length ? `Bcc: ${options.bcc.join(", ")}` : "",
        `Subject: ${options.subject}`,
        "Content-Type: text/html; charset=utf-8",
        options.inReplyTo ? `In-Reply-To: ${options.inReplyTo}` : "",
        options.references ? `References: ${options.references}` : "",
        "",
        options.body,
    ]
        .filter(Boolean)
        .join("\r\n");

    const encodedMessage = Buffer.from(messageParts)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
            threadId: options.threadId,
        },
    });

    return response.data;
}

export async function modifyThread(
    userId: string,
    threadId: string,
    options: { addLabelIds?: string[]; removeLabelIds?: string[] }
) {
    const gmail = await getGmailClient(userId);

    return gmail.users.threads.modify({
        userId: "me",
        id: threadId,
        requestBody: {
            addLabelIds: options.addLabelIds,
            removeLabelIds: options.removeLabelIds,
        },
    });
}

export async function trashThread(userId: string, threadId: string) {
    const gmail = await getGmailClient(userId);
    return gmail.users.threads.trash({ userId: "me", id: threadId });
}

export async function markAsRead(userId: string, threadId: string) {
    return modifyThread(userId, threadId, { removeLabelIds: ["UNREAD"] });
}

export async function markAsUnread(userId: string, threadId: string) {
    return modifyThread(userId, threadId, { addLabelIds: ["UNREAD"] });
}

export async function toggleStar(userId: string, threadId: string, starred: boolean) {
    if (starred) {
        return modifyThread(userId, threadId, { addLabelIds: ["STARRED"] });
    } else {
        return modifyThread(userId, threadId, { removeLabelIds: ["STARRED"] });
    }
}
