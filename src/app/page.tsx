"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Brain,
  Search,
  Shield,
  Zap,
  ArrowRight,
  ChevronDown,
  Star,
  MessageSquare,
  Calendar,
  Tag,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: <Sparkles size={24} />,
    title: "AI-Personalized Drafts",
    description:
      "Learns your writing style and generates replies that sound like you. Send in one click.",
    color: "#10b981",
  },
  {
    icon: <Brain size={24} />,
    title: "Memory & Context",
    description:
      "Remembers past conversations and preferences. Your inbox gets smarter over time.",
    color: "#059669",
  },
  {
    icon: <Search size={24} />,
    title: "Natural Language Search",
    description:
      'Find any email by describing it. "Emails from John about the budget last week."',
    color: "#34d399",
  },
  {
    icon: <Tag size={24} />,
    title: "Smart Categorization",
    description:
      "Auto-labels and organizes your inbox. Primary, updates, newsletters — sorted instantly.",
    color: "#6ee7b7",
  },
  {
    icon: <Calendar size={24} />,
    title: "Integrated Scheduling",
    description:
      "Calendar-aware drafting. Detects scheduling intent and suggests available time slots.",
    color: "#047857",
  },
  {
    icon: <Shield size={24} />,
    title: "Privacy First",
    description:
      "Your emails are never used for AI training. Zero data retention policy on all AI interactions.",
    color: "#a7f3d0",
  },
];

const faqs = [
  {
    q: "Which email providers are supported?",
    a: "Currently Gmail and Google Workspace. Outlook/Microsoft 365 support is in development.",
  },
  {
    q: "Is my email data used to train AI models?",
    a: "Absolutely not. We have a strict zero AI data retention policy. Your emails are processed in real-time and never stored for training purposes.",
  },
  {
    q: "How does the AI learn my writing style?",
    a: "Slashy analyzes your sent emails to understand your tone, vocabulary, and sentence structure. This profile is stored privately and used to personalize drafts.",
  },
  {
    q: "Can I use my own API keys?",
    a: "Yes! You can bring your own OpenAI, Anthropic, or Google Gemini API keys for AI features.",
  },
  {
    q: "Is it free?",
    a: "Slashy offers a generous free tier with limited AI drafts per day. Premium plans unlock unlimited AI features and priority support.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="faq-item"
      style={{
        borderBottom: "1px solid var(--border-light)",
        padding: "20px 0",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          fontSize: "16px",
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "left",
          padding: 0,
        }}
      >
        {q}
        <ChevronDown
          size={20}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s ease",
            color: "var(--text-tertiary)",
            flexShrink: 0,
            marginLeft: 16,
          }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            lineHeight: 1.7,
            paddingTop: 12,
          }}
        >
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="gradient-bg" style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={20} color="white" />
          </div>
          <span
            style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}
          >
            Slash<span className="gradient-text">y</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {session ? (
            <Link
              href="/inbox"
              className="nav-cta"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "var(--radius-full)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.15)";
                const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.08)";
                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.25)";
                e.currentTarget.style.boxShadow = "none";
                const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              Open Inbox
              <ArrowRight size={14} className="nav-arrow" style={{ transition: "transform 0.3s ease" }} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="nav-cta"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "var(--radius-full)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.15)";
                const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.08)";
                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.25)";
                e.currentTarget.style.boxShadow = "none";
                const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              Get Started
              <ArrowRight size={14} className="nav-arrow" style={{ transition: "transform 0.3s ease" }} />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 120,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 8s ease-in-out infinite reverse",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--accent-primary)",
              marginBottom: 32,
            }}
          >
            <Sparkles size={14} />
            AI-Native Email Client
          </motion.div>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 76px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 24,
            }}
          >
            Your inbox,
            <br />
            <span className="gradient-text">intelligently managed.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Slashy learns how you write, drafts replies in your voice, and
            organizes your inbox — so you spend less time on email and more on
            what matters.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={session ? "/inbox" : "/login"}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 17,
                padding: "16px 36px",
                textDecoration: "none",
              }}
            >
              {session ? "Open Inbox" : "Get Started Free"}
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 17,
                padding: "16px 36px",
                textDecoration: "none",
              }}
            >
              See Features
            </a>
          </div>
        </motion.div>

        {/* Mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          style={{
            maxWidth: 1100,
            margin: "80px auto 0",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="glass"
            style={{
              borderRadius: "var(--radius-xl)",
              padding: 2,
              boxShadow: "var(--shadow-xl), var(--accent-glow)",
            }}
          >
            <div
              style={{
                borderRadius: "calc(var(--radius-xl) - 2px)",
                background: "var(--bg-secondary)",
                padding: 24,
                minHeight: 400,
                display: "flex",
                gap: 16,
              }}
            >
              {/* Sidebar mockup */}
              <div
                style={{
                  width: 200,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-tertiary)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-primary)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Mail size={16} /> Inbox
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "rgba(255,255,255,0.2)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 11,
                    }}
                  >
                    12
                  </span>
                </div>
                {["Starred", "Sent", "Drafts"].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {item === "Starred" && <Star size={16} />}
                    {item === "Sent" && <ArrowRight size={16} />}
                    {item === "Drafts" && <MessageSquare size={16} />}
                    {item}
                  </div>
                ))}
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    padding: "0 12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Categories
                </div>
                {["Primary", "Updates", "Promotions"].map((cat) => (
                  <div
                    key={cat}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>

              {/* Thread list mockup */}
              <div
                style={{
                  flex: 1,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-primary)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {[
                  {
                    from: "Sarah Chen",
                    subject: "Q4 Strategy Review",
                    snippet: "Hey! I've updated the deck with the latest...",
                    time: "2m",
                    unread: true,
                  },
                  {
                    from: "Alex Rivera",
                    subject: "Design System v3.0",
                    snippet: "The new components are ready for review...",
                    time: "15m",
                    unread: true,
                  },
                  {
                    from: "Jordan Miles",
                    subject: "Re: Team Offsite Plans",
                    snippet: "I think we should go with Option B for...",
                    time: "1h",
                    unread: false,
                  },
                  {
                    from: "Priya Sharma",
                    subject: "API Integration Update",
                    snippet: "All endpoints are live now. Here's the...",
                    time: "3h",
                    unread: false,
                  },
                  {
                    from: "Marcus Lee",
                    subject: "Re: Weekly Standup Notes",
                    snippet: "Thanks for the summary. One thing I...",
                    time: "5h",
                    unread: false,
                  },
                ].map((email, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      background: email.unread
                        ? "var(--bg-selected)"
                        : "transparent",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-full)",
                        background: `hsl(${i * 60 + 220}, 60%, ${email.unread ? "55%" : "40%"})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {email.from[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: email.unread ? 700 : 500,
                            fontSize: 13,
                          }}
                        >
                          {email.from}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {email.time}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: email.unread ? 600 : 400,
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        {email.subject}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {email.snippet}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Draft panel mockup */}
              <div
                style={{
                  width: 280,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-tertiary)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent-primary)",
                  }}
                >
                  <Sparkles size={16} /> AI Draft
                </div>
                <div
                  style={{
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                  }}
                >
                  Hi Sarah,
                  <br />
                  <br />
                  Thanks for the update! The deck looks great. I have a few
                  suggestions on slide 7 regarding the Q4 projections.
                  <br />
                  <br />
                  Can we hop on a quick call tomorrow at 2pm to discuss?
                  <br />
                  <br />
                  Best,
                  <br />
                  You
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: "10px",
                      fontSize: 13,
                    }}
                  >
                    Use Draft
                  </button>
                  <button
                    className="btn-secondary"
                    style={{
                      padding: "10px 16px",
                      fontSize: 13,
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          padding: "120px 24px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            Everything your inbox{" "}
            <span className="gradient-text">should be</span>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            AI isn&apos;t a feature — it&apos;s the foundation.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass"
              style={{
                padding: 32,
                borderRadius: "var(--radius-xl)",
                cursor: "default",
                transition: "all var(--transition-normal)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 0 40px ${feature.color}20`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: `${feature.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color,
                  marginBottom: 20,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            How it <span className="gradient-text">works</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            {
              step: "01",
              title: "Connect your inbox",
              desc: "Sign in with Google and grant access. Your emails stay private — we never store them permanently.",
            },
            {
              step: "02",
              title: "AI learns your style",
              desc: "Slashy analyzes your sent emails to understand your tone, vocabulary, and patterns.",
            },
            {
              step: "03",
              title: "Get smart drafts",
              desc: "For every incoming email, receive an AI-generated reply that sounds like you. Review and send in one click.",
            },
            {
              step: "04",
              title: "Stay organized",
              desc: "Emails are auto-categorized, searchable in natural language, and always at your fingertips.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              <div
                className="gradient-text"
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 80,
                }}
              >
                {item.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            FAQ
          </h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} />
        ))}
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "100px 24px 120px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: 60,
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--accent-glow)",
          }}
        >
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            Ready to transform your inbox?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              marginBottom: 32,
            }}
          >
            Join thousands of professionals who spend less time on email.
          </p>
          <Link
            href={session ? "/inbox" : "/login"}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 17,
              padding: "16px 40px",
              textDecoration: "none",
            }}
          >
            {session ? "Open Inbox" : "Get Started Free"}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "40px 24px",
          borderTop: "1px solid var(--border-light)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Slashy</span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
          }}
        >
          © {new Date().getFullYear()} Slashy. Built with AI at its core.
        </p>
      </footer>
    </div>
  );
}
