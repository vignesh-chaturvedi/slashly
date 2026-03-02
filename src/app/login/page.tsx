"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Shield, Sparkles } from "lucide-react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.push("/inbox");
        }
    }, [session, router]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl: "/inbox" });
        } catch (error) {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div
                className="gradient-bg"
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    return (
        <div
            className="gradient-bg"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            {/* Decorative orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "15%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    animation: "pulse 6s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "20%",
                    right: "15%",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    animation: "pulse 8s ease-in-out infinite reverse",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass"
                style={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: "var(--radius-xl)",
                    padding: 48,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "var(--radius-lg)",
                            background: "var(--accent-gradient)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "var(--accent-glow)",
                        }}
                    >
                        <Zap size={24} color="white" />
                    </div>
                    <span
                        style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}
                    >
                        Slash<span className="gradient-text">y</span>
                    </span>
                </div>

                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        textAlign: "center",
                        marginBottom: 8,
                    }}
                >
                    Welcome back
                </h1>
                <p
                    style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        textAlign: "center",
                        marginBottom: 36,
                    }}
                >
                    Sign in to access your intelligent inbox
                </p>

                {/* Google Sign In */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "14px 20px",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border-medium)",
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: isLoading ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        transition: "all var(--transition-normal)",
                        opacity: isLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.background = "var(--bg-hover)";
                            e.currentTarget.style.borderColor = "var(--accent-primary)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-primary)";
                        e.currentTarget.style.borderColor = "var(--border-medium)";
                    }}
                >
                    {isLoading ? (
                        <div className="spinner" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Continue with Google
                </button>

                {/* Trust badges */}
                <div
                    style={{
                        marginTop: 32,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {[
                        {
                            icon: <Mail size={14} />,
                            text: "Full Gmail integration",
                        },
                        {
                            icon: <Sparkles size={14} />,
                            text: "AI-powered drafts & search",
                        },
                        {
                            icon: <Shield size={14} />,
                            text: "Your data is never used for training",
                        },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: 13,
                                color: "var(--text-tertiary)",
                            }}
                        >
                            <span style={{ color: "var(--accent-primary)" }}>
                                {badge.icon}
                            </span>
                            {badge.text}
                        </div>
                    ))}
                </div>

                {/* Back link */}
                <div style={{ textAlign: "center", marginTop: 32 }}>
                    <a
                        href="/"
                        style={{
                            fontSize: 13,
                            color: "var(--text-tertiary)",
                            textDecoration: "none",
                            transition: "color var(--transition-fast)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "var(--accent-primary)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--text-tertiary)")
                        }
                    >
                        ← Back to homepage
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
