# AGENTS.md — Socratic Debate Platform

## Who I Am?

I am ritvik, a founder who is learning how to code with ai-agents like cursor, claude. I think in problems first, then the solution and only then the code. Prioritize simple, readable solutions over clever ones. Always explain what you are doing and why before doing it.

## This Project
**What it does:** A single-user AI Socratic debate tool. Users submit beliefs; Claude challenges them using the Socratic method.
**Why it exists:** To help examine whether beliefs, principles, and theses are genuinely sound or built on unexamined assumptions.
**Status:** Active Development

## Tech Stack
- **Language:** TypeScript
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 + shadcn/ui v4
- **Database:** Railway PostgreSQL via Prisma ORM
- **AI:** Anthropic Claude API (claude-sonnet-4-5) — streaming responses
- **Package Manager:** pnpm
- **Deployment:** Railway

## Project Structure
```
/socratic-app
├── app/
│   ├── layout.tsx                       # Root layout with PasscodeGate
│   ├── page.tsx                         # Redirects to /debate
│   ├── globals.css                      # Design system (Tailwind 4)
│   ├── debate/
│   │   ├── page.tsx                     # New debate — blank chat interface
│   │   └── [id]/page.tsx               # Existing conversation view
│   ├── insights/
│   │   └── page.tsx                     # Insights dashboard
│   └── api/
│       ├── chat/route.ts               # POST — streams Claude response
│       ├── conversations/route.ts      # GET list, POST new
│       ├── conversations/[id]/route.ts # GET single, DELETE
│       ├── verify-passcode/route.ts    # POST — passcode check
│       └── insights/route.ts           # GET — computes + returns insights
├── components/
│   ├── examined/                        # App-specific UI components
│   └── ui/                             # shadcn/ui components
├── hooks/
│   ├── use-chat.ts                     # Streaming chat hook
│   └── use-conversations.ts            # Conversation CRUD hook
├── lib/
│   ├── anthropic.ts                    # Anthropic client + system prompt
│   ├── prisma.ts                       # Prisma client singleton
│   ├── insights.ts                     # Insight computation logic
│   └── utils.ts                        # Tailwind merge utility
├── prisma/
│   └── schema.prisma                   # Database schema
├── agent_docs/                         # Agent documentation
├── CLAUDE.md                           # Agent instructions (Claude Code)
├── AGENTS.md                           # This file (Cursor)
└── .env.local                          # Secrets — never commit
```

## How to Run
```bash
pnpm install
pnpm dev
```

## Agent Docs
Before starting work, check if any of these are relevant to your task and read them:

- `agent_docs/decisions.md` — key decisions made and why. Read this every session.
- `agent_docs/known-issues.md` — bugs we have hit and how we fixed them. Read before debugging.
- `agent_docs/architecture.md` — technical architecture detail. Read when touching core structure.
- `agent_docs/javascript-practices.md` — read if working in JavaScript/TypeScript.

## Key Conventions
- All API routes live in `app/api/`
- Anthropic client and system prompt live in `lib/anthropic.ts` — do not inline them elsewhere
- Database queries go through Prisma (`lib/prisma.ts`), never raw SQL
- Components are in `/components` — keep them small and single-purpose
- `.env.local` holds all secrets — never hardcode API keys
- Use `pnpm` (not npm or yarn)

## V1 Scope (do not over-build)
- No auth system — single user only
- No user table — use `'default_user'` string as user_id placeholder
- No dark mode
- No mobile optimisation — desktop first

## Design Principles
- Warm, minimal, journal-like aesthetic
- Typography is the product — generous font sizes, good line height (1.7)
- Sidebar left, chat right, top bar minimal
- Colour palette defined in `app/globals.css` — warm cream background, sand accents
- Font: Cormorant Garamond for headings/logo, Inter for body

## Passcode Protection
- The app has a `PasscodeGate` component wrapping the entire layout
- Passcode is verified server-side via `/api/verify-passcode` against `process.env.PASSCODE`
- The actual passcode is NEVER in client-side code — only `true/false` is returned
- `sessionStorage` key `'examined_auth'` is set on successful entry

## What NOT to Build Yet
- User authentication (V2)
- Mobile layout (V2)
- Public sharing of debates (V2)
- Fine-tuned models — system prompt is sufficient

## Universal Rules
- Always plan before coding. Show me the plan and wait for approval.
- Prefer editing existing files over creating new ones unless necessary.
- Never delete or overwrite working code without flagging it first.
- If something is unclear, ask one focused question before proceeding.
- After completing a task, summarize what changed and why in one paragraph.
- Do not add speculative or future-proofing code unless I ask for it.
