"use client";

import { EmailThread, EmailMessage } from "@/lib/gmail";
import { useEmailStore } from "@/stores/emailStore";
import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
    ArrowLeft,
    Reply,
    Forward,
    Trash2,
    Archive,
    Star,
    MoreHorizontal,
    Sparkles,
    ChevronDown,
    ChevronUp,
    ExternalLink,
} from "lucide-react";
import Composer from "./Composer";

interface MessageDetailProps {
    thread: EmailThread;
}

function MessageItem({
    message,
    isLast,
    threadSubject,
}: {
    message: EmailMessage;
    isLast: boolean;
    threadSubject: string;
}) {
    const [expanded, setExpanded] = useState(isLast);

    const hue =
        message.fromEmail
            .split("")
            .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

    let dateStr = "";
    let fullDateStr = "";
    try {
        const d = new Date(message.date);
        if (!isNaN(d.getTime())) {
            dateStr = formatDistanceToNow(d, { addSuffix: true });
            fullDateStr = format(d, "PPpp");
        }
    } catch { }

    return (
        <div
            style={{
                borderBottom: isLast ? "none" : "1px solid var(--border-light)",
                padding: "16px 0",
            }}
        >
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    cursor: "pointer",
                    padding: "4px 0",
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--radius-full)",
                        background: `hsl(${hue}, 55%, 50%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 15,
                        fontWeight: 700,
                        flexShrink: 0,
                    }}
                >
                    {message.from[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>
                                {message.from}
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "var(--text-tertiary)",
                                    marginLeft: 8,
                                }}
                            >
                                &lt;{message.fromEmail}&gt;
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span
                                style={{ fontSize: 12, color: "var(--text-tertiary)" }}
                                title={fullDateStr}
                            >
                                {dateStr}
                            </span>
                            {expanded ? (
                                <ChevronUp size={14} color="var(--text-tertiary)" />
                            ) : (
                                <ChevronDown size={14} color="var(--text-tertiary)" />
                            )}
                        </div>
                    </div>
                    {!expanded && (
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--text-tertiary)",
                                marginTop: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {message.bodyText?.slice(0, 120) || "..."}
                        </p>
                    )}
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: 16, paddingLeft: 52 }}>
                    {/* Recipients */}
                    <div
                        style={{
                            fontSize: 12,
                            color: "var(--text-tertiary)",
                            marginBottom: 16,
                        }}
                    >
                        to {message.to.join(", ")}
                        {message.cc.length > 0 && (
                            <span> · cc: {message.cc.join(", ")}</span>
                        )}
                    </div>

                    {/* Body */}
                    {message.bodyHtml ? (
                        <div
                            className="email-body"
                            dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
                            style={{
                                background: "var(--bg-secondary)",
                                borderRadius: "var(--radius-md)",
                                padding: 20,
                                maxHeight: 500,
                                overflow: "auto",
                            }}
                        />
                    ) : (
                        <pre
                            style={{
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: "var(--text-primary)",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                background: "var(--bg-secondary)",
                                borderRadius: "var(--radius-md)",
                                padding: 20,
                            }}
                        >
                            {message.bodyText}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MessageDetail({ thread }: MessageDetailProps) {
    const { selectThread, setShowAIDraft, showAIDraft, aiDraft, aiDraftLoading, setAIDraft, setAIDraftLoading, setComposing } = useEmailStore();
    const [replying, setReplying] = useState(false);
    const [forwarding, setForwarding] = useState(false);

    const lastMessage = thread.messages[thread.messages.length - 1];

    const handleGenerateDraft = async () => {
        setShowAIDraft(true);
        setAIDraftLoading(true);
        try {
            const response = await fetch("/api/ai/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: lastMessage.from,
                    subject: thread.subject,
                    emailBody: lastMessage.bodyText || lastMessage.bodyHtml,
                    threadHistory: thread.messages
                        .slice(0, -1)
                        .map((m) => `From: ${m.from}\n${m.bodyText}`)
                        .join("\n---\n"),
                }),
            });
            const data = await response.json();
            setAIDraft(data.draft || "Failed to generate draft.");
        } catch (error) {
            setAIDraft("Error generating draft. Please check your API key.");
        } finally {
            setAIDraftLoading(false);
        }
    };

    const handleThreadAction = async (action: string) => {
        try {
            await fetch(`/api/emails/${thread.id}/actions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
        } catch (error) {
            console.error("Action failed:", error);
        }
    };

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "var(--bg-primary)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        onClick={() => selectThread(null)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-tertiary)",
                            cursor: "pointer",
                            padding: 6,
                            borderRadius: "var(--radius-sm)",
                            display: "flex",
                            transition: "color var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 400,
                        }}
                    >
                        {thread.subject || "(no subject)"}
                    </h2>
                    {thread.category !== "primary" && (
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 500,
                                padding: "2px 10px",
                                borderRadius: "var(--radius-full)",
                                background: "var(--bg-tertiary)",
                                color: "var(--text-tertiary)",
                                textTransform: "capitalize",
                            }}
                        >
                            {thread.category}
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button
                        onClick={handleGenerateDraft}
                        className="btn-primary"
                        style={{
                            padding: "8px 14px",
                            fontSize: 12,
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Sparkles size={14} />
                        AI Draft
                    </button>
                    {[
                        { icon: <Reply size={16} />, action: () => setReplying(true), title: "Reply" },
                        { icon: <Forward size={16} />, action: () => setForwarding(true), title: "Forward" },
                        { icon: <Archive size={16} />, action: () => handleThreadAction("archive"), title: "Archive" },
                        { icon: <Trash2 size={16} />, action: () => handleThreadAction("trash"), title: "Trash" },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.action}
                            title={btn.title}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                                padding: 8,
                                borderRadius: "var(--radius-sm)",
                                display: "flex",
                                transition: "all var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "var(--text-primary)";
                                e.currentTarget.style.background = "var(--bg-hover)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--text-tertiary)";
                                e.currentTarget.style.background = "none";
                            }}
                        >
                            {btn.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages + AI Draft panel */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px 24px",
                    }}
                >
                    {thread.messages.map((message, i) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            isLast={i === thread.messages.length - 1}
                            threadSubject={thread.subject || ""}
                        />
                    ))}

                    {/* Reply composer */}
                    {(replying || forwarding) && (
                        <div style={{ marginTop: 16, paddingBottom: 24 }}>
                            <Composer
                                mode={replying ? "reply" : "forward"}
                                thread={thread}
                                message={lastMessage}
                                initialContent={aiDraft || ""}
                                onClose={() => {
                                    setReplying(false);
                                    setForwarding(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* AI Draft Panel */}
                {showAIDraft && (
                    <div
                        style={{
                            width: 320,
                            borderLeft: "1px solid var(--border-light)",
                            background: "var(--bg-secondary)",
                            padding: 20,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            overflowY: "auto",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "var(--accent-primary)",
                                }}
                            >
                                <Sparkles size={16} />
                                AI Draft
                            </div>
                            <button
                                onClick={() => setShowAIDraft(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--text-tertiary)",
                                    cursor: "pointer",
                                    fontSize: 18,
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {aiDraftLoading ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 40,
                                    gap: 12,
                                }}
                            >
                                <div className="spinner" style={{ width: 24, height: 24 }} />
                                <span
                                    style={{ fontSize: 13, color: "var(--text-tertiary)" }}
                                >
                                    Generating draft...
                                </span>
                            </div>
                        ) : (
                            <>
                                <div
                                    style={{
                                        background: "var(--bg-primary)",
                                        borderRadius: "var(--radius-md)",
                                        padding: 16,
                                        fontSize: 13,
                                        lineHeight: 1.7,
                                        color: "var(--text-secondary)",
                                        whiteSpace: "pre-wrap",
                                        border: "1px solid var(--border-light)",
                                    }}
                                >
                                    {aiDraft}
                                </div>

                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => {
                                            setReplying(true);
                                            setShowAIDraft(false);
                                            // aiDraft stays in store so Composer can read it
                                        }}
                                        className="btn-primary"
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            fontSize: 13,
                                            borderRadius: "var(--radius-md)",
                                        }}
                                    >
                                        Use Draft
                                    </button>
                                    <button
                                        onClick={handleGenerateDraft}
                                        className="btn-secondary"
                                        style={{
                                            padding: "10px 16px",
                                            fontSize: 13,
                                            borderRadius: "var(--radius-md)",
                                        }}
                                    >
                                        Regenerate
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
