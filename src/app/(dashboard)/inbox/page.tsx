"use client";

import { useEffect, useCallback, useState } from "react";
import { useEmailStore } from "@/stores/emailStore";
import ThreadList from "@/components/email/ThreadList";
import MessageDetail from "@/components/email/MessageDetail";
import SearchBar from "@/components/email/SearchBar";
import Composer from "@/components/email/Composer";
import { RefreshCw } from "lucide-react";

export default function InboxPage() {
    const {
        threads,
        setThreads,
        selectedThread,
        selectThread,
        isLoading,
        setLoading,
        setError,
        category,
        searchQuery,
        isComposing,
        setComposing,
    } = useEmailStore();

    const [refreshing, setRefreshing] = useState(false);

    const fetchEmails = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (searchQuery) params.set("q", searchQuery);
            params.set("maxResults", "25");

            const response = await fetch(`/api/emails?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch emails");
            }

            const data = await response.json();
            setThreads(data.threads || []);
        } catch (error: any) {
            setError(error.message);
            setThreads([]);
        } finally {
            setLoading(false);
        }
    }, [category, searchQuery, setThreads, setLoading, setError]);

    useEffect(() => {
        fetchEmails();
    }, [fetchEmails]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchEmails();
        setRefreshing(false);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            switch (e.key) {
                case "c":
                    e.preventDefault();
                    setComposing(true);
                    break;
                case "Escape":
                    if (selectedThread) {
                        selectThread(null);
                    }
                    if (isComposing) {
                        setComposing(false);
                    }
                    break;
                case "j": {
                    e.preventDefault();
                    const currentIndex = threads.findIndex(
                        (t) => t.id === selectedThread?.id
                    );
                    if (currentIndex < threads.length - 1) {
                        selectThread(threads[currentIndex + 1]);
                    }
                    break;
                }
                case "k": {
                    e.preventDefault();
                    const currentIdx = threads.findIndex(
                        (t) => t.id === selectedThread?.id
                    );
                    if (currentIdx > 0) {
                        selectThread(threads[currentIdx - 1]);
                    }
                    break;
                }
                case "r":
                    if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
                        handleRefresh();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedThread, threads, isComposing, selectThread, setComposing]);

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexShrink: 0,
                    background: "var(--bg-primary)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {{ primary: "Inbox", starred: "Starred", sent: "Sent", drafts: "Drafts", archive: "Archive", trash: "Trash", updates: "Updates", social: "Social", promotions: "Promotions", forums: "Forums" }[category] || "Inbox"}
                    </h1>
                    <button
                        onClick={handleRefresh}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-tertiary)",
                            cursor: "pointer",
                            padding: 6,
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
                        title="Refresh (R)"
                    >
                        <RefreshCw
                            size={16}
                            style={{
                                animation: refreshing ? "spin 1s linear infinite" : "none",
                            }}
                        />
                    </button>
                </div>

                <SearchBar />

                <div
                    style={{
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                        whiteSpace: "nowrap",
                    }}
                >
                    {threads.length} conversations
                </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Thread list */}
                <div
                    style={{
                        width: selectedThread ? 380 : "100%",
                        maxWidth: selectedThread ? 380 : "100%",
                        borderRight: selectedThread
                            ? "1px solid var(--border-light)"
                            : "none",
                        transition: "width var(--transition-normal)",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <ThreadList threads={threads} isLoading={isLoading} />
                </div>

                {/* Message detail */}
                {selectedThread && (
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <MessageDetail thread={selectedThread} />
                    </div>
                )}

                {/* Empty state when no thread selected */}
                {!selectedThread && !isLoading && threads.length > 0 && (
                    <div
                        style={{
                            display: "none",
                        }}
                    />
                )}
            </div>

            {/* Floating composer */}
            {isComposing && (
                <Composer
                    mode="compose"
                    onClose={() => setComposing(false)}
                    onSent={handleRefresh}
                />
            )}
        </div>
    );
}
