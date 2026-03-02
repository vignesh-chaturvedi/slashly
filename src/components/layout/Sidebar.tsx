"use client";

import { signOut, useSession } from "next-auth/react";
import { useEmailStore } from "@/stores/emailStore";
import {
    Inbox,
    Star,
    Send,
    FileText,
    Zap,
    PenSquare,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Archive,
} from "lucide-react";

export default function Sidebar() {
    const { data: session } = useSession();
    const { sidebarCollapsed, toggleSidebar, setComposing, category, setCategory } = useEmailStore();

    const navItems = [
        { icon: <Inbox size={18} />, label: "Inbox", value: "primary" },
        { icon: <Star size={18} />, label: "Starred", value: "starred" },
        { icon: <Send size={18} />, label: "Sent", value: "sent" },
        { icon: <FileText size={18} />, label: "Drafts", value: "drafts" },
        { icon: <Archive size={18} />, label: "Archive", value: "archive" },
        { icon: <Trash2 size={18} />, label: "Trash", value: "trash" },
    ];

    const categories = [
        { label: "Updates", value: "updates", color: "#34d399" },
        { label: "Social", value: "social", color: "#6ee7b7" },
        { label: "Promotions", value: "promotions", color: "#a7f3d0" },
    ];

    return (
        <aside
            style={{
                width: sidebarCollapsed ? 68 : 240,
                height: "100vh",
                background: "var(--bg-secondary)",
                borderRight: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                transition: "width var(--transition-normal)",
                overflow: "hidden",
                flexShrink: 0,
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: sidebarCollapsed ? "16px 12px" : "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarCollapsed ? "center" : "space-between",
                    borderBottom: "1px solid var(--border-light)",
                    minHeight: 64,
                }}
            >
                {!sidebarCollapsed && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "var(--radius-md)",
                                background: "var(--accent-gradient)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Zap size={16} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 18 }}>
                            Slash<span className="gradient-text">y</span>
                        </span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-tertiary)",
                        cursor: "pointer",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "var(--radius-sm)",
                        transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
                >
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Compose button */}
            <div style={{ padding: sidebarCollapsed ? "12px 10px" : "12px 16px" }}>
                <button
                    onClick={() => setComposing(true)}
                    className="btn-primary"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: sidebarCollapsed ? 0 : 8,
                        padding: sidebarCollapsed ? "12px" : "10px 16px",
                        fontSize: 13,
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    <PenSquare size={16} />
                    {!sidebarCollapsed && "Compose"}
                </button>
            </div>

            {/* Navigation */}
            <nav
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: sidebarCollapsed ? "4px 10px" : "4px 12px",
                }}
            >
                {navItems.map((item) => {
                    const isActive = category === item.value;
                    return (
                        <button
                            key={item.value}
                            onClick={() => setCategory(item.value)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 12px",
                                borderRadius: "var(--radius-md)",
                                color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                                fontSize: 13,
                                fontWeight: isActive ? 600 : 400,
                                background: isActive ? "var(--bg-selected)" : "transparent",
                                transition: "all var(--transition-fast)",
                                marginBottom: 2,
                                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                textAlign: "left",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = isActive ? "var(--bg-selected)" : "transparent";
                            }}
                        >
                            {item.icon}
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                    );
                })}

                {/* Categories */}
                {!sidebarCollapsed && (
                    <>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "var(--text-tertiary)",
                                padding: "16px 12px 8px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Categories
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "8px 12px",
                                    borderRadius: "var(--radius-md)",
                                    color: category === cat.value ? "var(--text-primary)" : "var(--text-tertiary)",
                                    background: category === cat.value ? "var(--bg-hover)" : "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    width: "100%",
                                    textAlign: "left",
                                    transition: "all var(--transition-fast)",
                                    marginBottom: 2,
                                }}
                                onMouseEnter={(e) => {
                                    if (category !== cat.value) e.currentTarget.style.background = "var(--bg-hover)";
                                }}
                                onMouseLeave={(e) => {
                                    if (category !== cat.value) e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: cat.color,
                                    }}
                                />
                                {cat.label}
                            </button>
                        ))}
                    </>
                )}
            </nav>

            {/* User section */}
            <div
                style={{
                    padding: sidebarCollapsed ? "12px 10px" : "12px 16px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                }}
            >
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-full)",
                        background: "var(--accent-gradient)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                        flexShrink: 0,
                        overflow: "hidden",
                    }}
                >
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        session?.user?.name?.[0] || "U"
                    )}
                </div>
                {!sidebarCollapsed && (
                    <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {session?.user?.name}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--text-tertiary)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {session?.user?.email}
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-tertiary)",
                                cursor: "pointer",
                                padding: 4,
                                display: "flex",
                                borderRadius: "var(--radius-sm)",
                            }}
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
