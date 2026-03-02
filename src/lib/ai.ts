import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getModel() {
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function generateDraft(
    emailContext: {
        from: string;
        subject: string;
        body: string;
        threadHistory?: string;
    },
    userStyle?: string
): Promise<string> {
    const systemPrompt = `You are an AI email assistant that drafts replies in the user's voice. 
${userStyle ? `The user's writing style: ${userStyle}` : "Write in a professional, clear, and helpful tone."}

Rules:
- Match the formality level of the incoming email
- Write a complete, fully-formed email response with AT LEAST 4-6 sentences
- Include a proper greeting, substantive body paragraphs, and a sign-off
- Address the key points in the incoming email thoroughly
- Use the same language as the incoming email
- Don't include the subject line in the reply body
- Start directly with the response, no "Hi" if the original didn't have it
- End with a simple sign-off like "Best regards," or "Thanks,"
- Return ONLY the email body text, no metadata
- IMPORTANT: Do NOT write a short one-sentence reply. Write a complete, thoughtful response.`;

    const userPrompt = `Draft a reply to this email:

From: ${emailContext.from}
Subject: ${emailContext.subject}

${emailContext.body}

${emailContext.threadHistory ? `Previous messages in thread:\n${emailContext.threadHistory}` : ""}`;

    try {
        const model = getModel();
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.7,
            },
        });

        return result.response.text() || "Unable to generate draft.";
    } catch (error: any) {
        console.error("AI draft generation error:", error);
        if (error?.status === 429) {
            throw new Error("AI rate limited — please wait 30 seconds and try again");
        }
        throw new Error(error?.message || "Failed to generate AI draft");
    }
}

export async function categorizeEmail(
    email: { from: string; subject: string; snippet: string }
): Promise<string> {
    try {
        const model = getModel();
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{
                    text: `Categorize this email into exactly one of these categories: primary, updates, social, promotions, newsletters, forums. Respond with only the category name, nothing else.

From: ${email.from}
Subject: ${email.subject}
Snippet: ${email.snippet}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 10,
                temperature: 0,
            },
        });

        const category = result.response.text()?.trim().toLowerCase() || "primary";
        const validCategories = ["primary", "updates", "social", "promotions", "newsletters", "forums"];
        return validCategories.includes(category) ? category : "primary";
    } catch (error) {
        console.error("AI categorization error:", error);
        return "primary";
    }
}

export async function smartSearch(query: string): Promise<string> {
    try {
        const model = getModel();
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{
                    text: `Convert the user's natural language email search query into a Gmail search query string. 
Use Gmail search operators like from:, to:, subject:, after:, before:, has:attachment, is:unread, label:, etc.
Respond with ONLY the Gmail search query, nothing else.

Examples:
- "emails from John about the project" → "from:john subject:project"
- "unread emails with attachments from last week" → "is:unread has:attachment newer_than:7d"
- "newsletters I received in January" → "category:promotions OR label:newsletters after:2024/01/01 before:2024/02/01"

Query: ${query}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0,
            },
        });

        return result.response.text()?.trim() || query;
    } catch (error) {
        console.error("Smart search error:", error);
        return query;
    }
}

export async function summarizeThread(messages: Array<{ from: string; body: string; date: string }>): Promise<string> {
    try {
        const threadContent = messages
            .map((m) => `From: ${m.from} (${m.date})\n${m.body}`)
            .join("\n---\n");

        const model = getModel();
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{
                    text: `Summarize this email thread in 2-3 concise bullet points. Focus on key decisions, action items, and important information.\n\n${threadContent}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.3,
            },
        });

        return result.response.text() || "Unable to summarize.";
    } catch (error) {
        console.error("Thread summary error:", error);
        throw new Error("Failed to summarize thread");
    }
}
