"use client";

import { EmailThread } from "@/lib/gmail";
import { useEmailStore } from "@/stores/emailStore";
import { formatDistanceToNow } from "date-fns";
import { Star, Paperclip } from "lucide-react";

interface ThreadListProps {
    threads: EmailThread[];
    isLoading: boolean;
}

export default function ThreadList({ threads, isLoading }: ThreadListProps) {
    const { selectedThread, selectThread } = useEmailStore();

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: 8,
                }}
            >
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            padding: "16px",
                            borderRadius: "var(--radius-md)",
                            background: "var(--bg-hover)",
                            animation: "pulse 1.5s ease-in-out infinite",
                            animationDelay: `${i * 100}ms`,
                            opacity: 0.5,
                            height: 76,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (threads.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    padding: 40,
                    color: "var(--text-tertiary)",
                }}
            >
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>No emails found</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                    Your inbox is clean!
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "4px 8px",
                overflowY: "auto",
                height: "100%",
            }}
        >
            {threads.map((thread) => {
                const isSelected = selectedThread?.id === thread.id;
                const isUnread = !thread.isRead;

                let timeStr = "";
                try {
                    const date = new Date(thread.date);
                    if (!isNaN(date.getTime())) {
                        timeStr = formatDistanceToNow(date, { addSuffix: false });
                        // Shorten common suffixes
                        timeStr = timeStr
                            .replace(" minutes", "m")
                            .replace(" minute", "m")
                            .replace(" hours", "h")
                            .replace(" hour", "h")
                            .replace(" days", "d")
                            .replace(" day", "d")
                            .replace("about ", "")
                            .replace("less than a", "<1");
                    }
                } catch {
                    timeStr = "";
                }

                // Generate avatar color from email
                const hue =
                    thread.fromEmail
                        .split("")
                        .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

                return (
                    <div
                        key={thread.id}
                        onClick={() => selectThread(thread)}
                        style={{
                            display: "flex",
                            gap: 12,
                            padding: "12px 14px",
                            borderRadius: "var(--radius-md)",
                            cursor: "pointer",
                            background: isSelected
                                ? "var(--bg-selected)"
                                : "transparent",
                            transition: "background var(--transition-fast)",
                            borderLeft: isSelected
                                ? "3px solid var(--accent-primary)"
                                : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (!isSelected)
                                e.currentTarget.style.background = "var(--bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected)
                                e.currentTarget.style.background = "transparent";
                        }}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: "var(--radius-full)",
                                background: `hsl(${hue}, 55%, 50%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: 14,
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {thread.from[0]?.toUpperCase() || "?"}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 2,
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: isUnread ? 700 : 500,
                                        fontSize: 13,
                                        color: isUnread
                                            ? "var(--text-primary)"
                                            : "var(--text-secondary)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {thread.from}
                                </span>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        flexShrink: 0,
                                    }}
                                >
                                    {thread.isStarred && (
                                        <Star
                                            size={12}
                                            fill="var(--warning)"
                                            color="var(--warning)"
                                        />
                                    )}
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: "var(--text-tertiary)",
                                            fontWeight: isUnread ? 600 : 400,
                                        }}
                                    >
                                        {timeStr}
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    fontWeight: isUnread ? 600 : 400,
                                    fontSize: 13,
                                    marginBottom: 2,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {thread.subject || "(no subject)"}
                                {thread.messageCount > 1 && (
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: "var(--text-tertiary)",
                                            fontWeight: 400,
                                            marginLeft: 6,
                                        }}
                                    >
                                        ({thread.messageCount})
                                    </span>
                                )}
                            </div>

                            <div
                                style={{
                                    fontSize: 12,
                                    color: "var(--text-tertiary)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    lineHeight: 1.4,
                                }}
                            >
                                {thread.snippet}
                            </div>
                        </div>

                        {/* Unread indicator */}
                        {isUnread && (
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "var(--accent-primary)",
                                    flexShrink: 0,
                                    marginTop: 6,
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
