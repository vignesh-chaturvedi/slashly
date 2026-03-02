"use client";

import { useState, useEffect } from "react";
import { EmailThread, EmailMessage } from "@/lib/gmail";
import { Send, X, Minus, Maximize2 } from "lucide-react";

interface ComposerProps {
    mode?: "compose" | "reply" | "forward";
    thread?: EmailThread;
    message?: EmailMessage;
    initialContent?: string;
    onClose: () => void;
    onSent?: () => void;
}

export default function Composer({
    mode = "compose",
    thread,
    message,
    initialContent = "",
    onClose,
    onSent,
}: ComposerProps) {
    const [to, setTo] = useState(
        mode === "reply" && message ? message.fromEmail : ""
    );
    const [cc, setCc] = useState("");
    const [bcc, setBcc] = useState("");
    const [subject, setSubject] = useState(
        mode === "reply"
            ? `Re: ${thread?.subject || ""}`
            : mode === "forward"
                ? `Fwd: ${thread?.subject || ""}`
                : ""
    );
    const [content, setContent] = useState(initialContent);
    const [sending, setSending] = useState(false);
    const [showCc, setShowCc] = useState(false);
    const [minimized, setMinimized] = useState(false);

    // Sync initialContent to state if it changes (e.g. when "Use Draft" is clicked)
    useEffect(() => {
        if (initialContent) setContent(initialContent);
    }, [initialContent]);

    const handleSend = async () => {
        if (!to.trim() || !content.trim()) return;

        setSending(true);
        try {
            const response = await fetch("/api/emails/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: to.split(",").map((e) => e.trim()),
                    cc: cc
                        ? cc.split(",").map((e) => e.trim())
                        : [],
                    bcc: bcc
                        ? bcc.split(",").map((e) => e.trim())
                        : [],
                    subject,
                    content: `<div>${content.replace(/\n/g, "<br/>")}</div>`,
                    threadId: mode !== "compose" ? thread?.gmailId : undefined,
                }),
            });

            if (response.ok) {
                onSent?.();
                onClose();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to send email");
            }
        } catch (error) {
            alert("Failed to send email. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (minimized) {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    right: 24,
                    width: 320,
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--border-light)",
                    borderBottom: "none",
                    zIndex: 100,
                }}
            >
                <div
                    onClick={() => setMinimized(false)}
                    style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-light)",
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {mode === "reply" ? "Reply" : mode === "forward" ? "Forward" : "New Message"}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMinimized(false);
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                                padding: 4,
                            }}
                        >
                            <Maximize2 size={14} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                                padding: 4,
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isInline = mode !== "compose";

    const composerUI = (
        <div
            style={{
                background: "var(--bg-secondary)",
                borderRadius: isInline ? "var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) 0 0",
                border: "1px solid var(--border-light)",
                boxShadow: isInline ? "var(--shadow-md)" : "var(--shadow-lg)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                ...(isInline
                    ? {}
                    : {
                        position: "fixed" as const,
                        bottom: 0,
                        right: 24,
                        width: 560,
                        maxHeight: "70vh",
                        zIndex: 100,
                        borderBottom: "none",
                    }),
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "10px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-light)",
                    background: "var(--bg-tertiary)",
                }}
            >
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                    {mode === "reply"
                        ? "Reply"
                        : mode === "forward"
                            ? "Forward"
                            : "New Message"}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                    {!isInline && (
                        <button
                            onClick={() => setMinimized(true)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                                padding: 4,
                                display: "flex",
                            }}
                        >
                            <Minus size={14} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-tertiary)",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Fields */}
            <div style={{ padding: "0 16px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid var(--border-light)",
                        padding: "8px 0",
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            color: "var(--text-tertiary)",
                            width: 50,
                            flexShrink: 0,
                        }}
                    >
                        To
                    </span>
                    <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipients@example.com"
                        style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            fontSize: 13,
                            color: "var(--text-primary)",
                            padding: "4px 0",
                        }}
                    />
                    {!showCc && (
                        <button
                            onClick={() => setShowCc(true)}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: 12,
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                            }}
                        >
                            Cc/Bcc
                        </button>
                    )}
                </div>

                {showCc && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid var(--border-light)",
                                padding: "8px 0",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--text-tertiary)",
                                    width: 50,
                                    flexShrink: 0,
                                }}
                            >
                                Cc
                            </span>
                            <input
                                type="text"
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    fontSize: 13,
                                    color: "var(--text-primary)",
                                    padding: "4px 0",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid var(--border-light)",
                                padding: "8px 0",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--text-tertiary)",
                                    width: 50,
                                    flexShrink: 0,
                                }}
                            >
                                Bcc
                            </span>
                            <input
                                type="text"
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    fontSize: 13,
                                    color: "var(--text-primary)",
                                    padding: "4px 0",
                                }}
                            />
                        </div>
                    </>
                )}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid var(--border-light)",
                        padding: "8px 0",
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            color: "var(--text-tertiary)",
                            width: 50,
                            flexShrink: 0,
                        }}
                    >
                        Sub
                    </span>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            fontSize: 13,
                            color: "var(--text-primary)",
                            fontWeight: 500,
                            padding: "4px 0",
                        }}
                    />
                </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 16 }}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your message..."
                    style={{
                        width: "100%",
                        minHeight: isInline ? 150 : 200,
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        color: "var(--text-primary)",
                        lineHeight: 1.6,
                        resize: "vertical",
                        fontFamily: "inherit",
                    }}
                />
            </div>

            {/* Footer */}
            <div
                style={{
                    padding: "10px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border-light)",
                }}
            >
                <button
                    onClick={handleSend}
                    disabled={sending || !to.trim()}
                    className="btn-primary"
                    style={{
                        padding: "8px 20px",
                        fontSize: 13,
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        opacity: sending || !to.trim() ? 0.5 : 1,
                        cursor: sending || !to.trim() ? "not-allowed" : "pointer",
                    }}
                >
                    {sending ? (
                        <div className="spinner" style={{ width: 14, height: 14 }} />
                    ) : (
                        <Send size={14} />
                    )}
                    {sending ? "Sending..." : "Send"}
                </button>
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-tertiary)",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "8px 12px",
                    }}
                >
                    Discard
                </button>
            </div>
        </div>
    );

    return composerUI;
}
