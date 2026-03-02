"use client";

import { useState, useRef } from "react";
import { useEmailStore } from "@/stores/emailStore";
import { Search, Sparkles, X } from "lucide-react";

export default function SearchBar() {
    const { searchQuery, setSearchQuery } = useEmailStore();
    const [focused, setFocused] = useState(false);
    const [isAISearch, setIsAISearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        if (isAISearch) {
            try {
                const res = await fetch("/api/ai/search", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: searchQuery }),
                });
                const data = await res.json();
                if (data.gmailQuery) {
                    setSearchQuery(data.gmailQuery);
                }
            } catch (error) {
                console.error("AI search failed:", error);
            }
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            style={{
                position: "relative",
                maxWidth: 600,
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: focused ? "var(--bg-primary)" : "var(--bg-tertiary)",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${focused ? "var(--accent-primary)" : "var(--border-light)"}`,
                    transition: "all var(--transition-fast)",
                    boxShadow: focused ? "0 0 0 3px rgba(16, 185, 129, 0.15)" : "none",
                    padding: "0 4px",
                }}
            >
                <div style={{ padding: "0 10px", display: "flex", color: "var(--text-tertiary)" }}>
                    <Search size={16} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={
                        isAISearch
                            ? 'Try: "emails from John about the project last week"'
                            : "Search emails..."
                    }
                    style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontSize: 13,
                        color: "var(--text-primary)",
                        padding: "10px 0",
                    }}
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
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
                )}
                <button
                    type="button"
                    onClick={() => setIsAISearch(!isAISearch)}
                    title={isAISearch ? "AI search enabled" : "Enable AI search"}
                    style={{
                        background: isAISearch ? "var(--accent-primary)" : "none",
                        border: "none",
                        color: isAISearch ? "white" : "var(--text-tertiary)",
                        cursor: "pointer",
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        margin: "4px",
                        transition: "all var(--transition-fast)",
                    }}
                >
                    <Sparkles size={12} />
                    AI
                </button>
            </div>
        </form>
    );
}
