<div align="center">

# ⚡ Slashy

**AI-native email client that thinks before you type.**

Built with Next.js 16 · Google Gemini · Gmail API · Zustand

[Live Demo](https://slashy.vercel.app) · [Report Bug](https://github.com/vignesh-chaturvedi/slashy/issues) · [Request Feature](https://github.com/vignesh-chaturvedi/slashy/issues)

</div>

---

## Overview

Slashy is an **AI-first email client** where intelligence isn't bolted on — it's the foundation. It connects to your Gmail account via OAuth 2.0, renders your inbox in a modern split-pane interface, and uses Google's Gemini LLM to draft context-aware replies that match your writing style.

Unlike traditional email clients that treat AI as a sidebar feature, Slashy weaves it into every interaction: drafting, searching, categorizing, and triaging — so you spend less time managing email and more time on what matters.

---

## Features

### 🤖 AI-Powered Draft Generation
- Generates full-length, context-aware email replies using **Google Gemini 2.5 Flash**
- Analyzes the entire thread history to produce coherent, multi-paragraph responses
- One-click "Use Draft" flow that pre-fills the reply composer instantly
- Regenerate drafts on demand for alternative phrasing

### 🔍 Natural Language Search
- Search your inbox using plain English queries (e.g., *"emails from John about the budget last week"*)
- AI translates natural language into structured Gmail search operators (`from:`, `subject:`, `newer_than:`, etc.)
- Powered by Gemini with zero-temperature inference for deterministic query translation

### 🏷️ Smart Categorization
- Auto-classifies incoming emails into **Primary**, **Updates**, **Social**, **Promotions**, **Newsletters**, and **Forums**
- Inference runs per-message using a constrained Gemini prompt with deterministic output
- Seamless category-based navigation in the sidebar

### 📬 Full Gmail Integration
- Bi-directional sync via the **Gmail REST API** with `googleapis` SDK
- Thread-based conversation view with collapsible message history
- Send, reply, forward, archive, trash, and star operations
- Real-time inbox refresh with optimistic UI updates

### ⌨️ Keyboard-First UX
- `j`/`k` for thread navigation, `c` to compose, `r` to refresh, `Escape` to deselect
- Designed for power users who prefer keyboard over mouse

### 🎨 Modern Dark UI
- Minimal **green & black** design language inspired by modern AI interfaces
- Glassmorphism effects, smooth micro-animations via **Framer Motion**
- Fully responsive split-pane layout with collapsible sidebar

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)               │
├──────────────┬──────────────┬───────────────────────────┤
│   Frontend   │   API Layer  │      External Services     │
│              │              │                            │
│  React 19    │  /api/emails │  Gmail REST API            │
│  Zustand     │  /api/ai/*   │  Google Gemini 2.5 Flash   │
│  Framer      │  NextAuth.js │  Google OAuth 2.0          │
│  Motion      │  Prisma ORM  │  Neon PostgreSQL           │
└──────────────┴──────────────┴───────────────────────────┘
```

### Request Flow

1. **Authentication** — NextAuth.js handles Google OAuth 2.0 with PKCE, storing access/refresh tokens via Prisma adapter
2. **Email Sync** — Server-side API routes call Gmail API using the user's OAuth token, fetching threads with full message payloads
3. **AI Inference** — Draft generation, categorization, and search translation are handled server-side via the `@google/generative-ai` SDK with per-task `generationConfig` (temperature, token limits)
4. **State Management** — Zustand store manages client-side state (selected thread, draft content, loading states) with no prop drilling
5. **Rendering** — Split-pane layout with virtualized thread list and HTML email body rendering via `dangerouslySetInnerHTML` with sanitization

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Next.js 16 (App Router, Turbopack) | SSR, API routes, file-based routing |
| **UI** | React 19, Framer Motion, Lucide Icons | Component rendering, animations, iconography |
| **State** | Zustand | Global client state (zero boilerplate) |
| **Styling** | Tailwind CSS 4, CSS Custom Properties | Utility-first + design token system |
| **Auth** | NextAuth.js 4 + Google OAuth 2.0 | Session management, token refresh |
| **AI** | Google Gemini 2.5 Flash (`@google/generative-ai`) | Draft generation, categorization, NL search |
| **Email** | Gmail REST API (`googleapis`) | Full inbox CRUD operations |
| **Database** | PostgreSQL (Neon) + Prisma ORM | User/account/token persistence |
| **Deployment** | Vercel | Edge-optimized hosting, serverless functions |

---

## Project Structure

```
slashy/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── inbox/page.tsx      # Main inbox view with split-pane layout
│   │   │   └── layout.tsx          # Auth-gated dashboard shell
│   │   ├── api/
│   │   │   ├── ai/draft/route.ts   # POST — AI draft generation endpoint
│   │   │   ├── ai/search/route.ts  # POST — NL-to-Gmail query translation
│   │   │   ├── auth/[...nextauth]/ # OAuth callback handler
│   │   │   ├── emails/route.ts     # GET — Fetch threads from Gmail
│   │   │   └── emails/send/route.ts# POST — Send/reply via Gmail API
│   │   ├── login/page.tsx          # OAuth login page
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   └── globals.css             # Design tokens & global styles
│   ├── components/
│   │   ├── email/
│   │   │   ├── Composer.tsx        # Reply/forward/compose form
│   │   │   ├── MessageDetail.tsx   # Thread view + AI draft panel
│   │   │   ├── SearchBar.tsx       # Search input with AI toggle
│   │   │   └── ThreadList.tsx      # Email thread list with avatars
│   │   ├── layout/
│   │   │   └── Sidebar.tsx         # Collapsible nav sidebar
│   │   └── Providers.tsx           # NextAuth SessionProvider wrapper
│   ├── lib/
│   │   ├── ai.ts                   # Gemini SDK: draft, categorize, search, summarize
│   │   ├── auth.ts                 # NextAuth config + Prisma adapter
│   │   └── gmail.ts                # Gmail API wrapper (fetch, send, actions)
│   ├── stores/
│   │   └── emailStore.ts           # Zustand store (threads, drafts, UI state)
│   └── types/
│       └── next-auth.d.ts          # Session type augmentation
├── prisma/
│   └── schema.prisma               # User, Account, Session models
├── .env.example                     # Required environment variables
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **PostgreSQL** database (recommended: [Neon](https://neon.tech))
- **Google Cloud Console** project with Gmail API + OAuth 2.0 credentials
- **Google Gemini API** key from [AI Studio](https://aistudio.google.com)

### Setup

```bash
# Clone the repository
git clone https://github.com/vignesh-chaturvedi/slashy.git
cd slashy

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Fill in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:pass@host/slashy?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<openssl rand -base64 32>"

# Google OAuth 2.0 (console.cloud.google.com)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Google Gemini (aistudio.google.com)
GEMINI_API_KEY="your-gemini-api-key"
```

```bash
# Initialize the database
npx prisma migrate dev

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the same environment variables in your Vercel project settings under **Settings → Environment Variables**.

> **Important:** In your Google Cloud Console, add your Vercel deployment URL to the **Authorized redirect URIs** (`https://your-app.vercel.app/api/auth/callback/google`).

---

## Design Decisions

| Decision | Rationale |
|---|---|
| **AI-first architecture** | AI is embedded in every interaction (draft, search, categorize) — not a feature toggle |
| **Server-side AI calls** | API keys never touch the client; all Gemini inference runs in Next.js API routes |
| **Zustand over Redux** | Minimal boilerplate, perfect for mid-size state graphs without the ceremony |
| **CSS Custom Properties** | Design tokens (`--accent-primary`, `--bg-secondary`) enable theme-wide changes from a single file |
| **No email storage** | Emails are fetched live from Gmail API — zero data retention, privacy by default |
| **Gemini 2.5 Flash** | Optimized for speed + cost on high-volume inference tasks (categorization, search translation) |

---

## Roadmap

- [ ] Microsoft Outlook / Graph API integration
- [ ] Per-user writing style learning from sent email corpus
- [ ] Semantic search via vector embeddings (pgvector)
- [ ] Google Calendar integration with AI scheduling assistant
- [ ] Reusable snippets / quick replies with variable interpolation
- [ ] Email analytics dashboard (response times, volume, top contacts)
- [ ] Desktop push notifications via Web Push API
- [ ] SMS interface via Twilio for inbox summaries on the go

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ☕ and AI at its core.**

</div>
