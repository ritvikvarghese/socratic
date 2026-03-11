# Architecture

Technical architecture of the Socratic Debate Platform. Update when the structure meaningfully changes.

---
## Overview
A single-user Socratic debate tool built as a Next.js 16 App Router application. The user submits a belief or claim via a chat interface. The backend sends the full conversation history to the Anthropic Claude API with a personalized Socratic system prompt, streaming the response back via Server-Sent Events. Conversations are persisted in Railway PostgreSQL via Prisma ORM. An insights dashboard aggregates patterns across all past conversations.

## Key Components

| File / Module | Purpose |
|---------------|---------|
| `app/layout.tsx` | Root layout — wraps all pages with PasscodeGate, fonts |
| `app/debate/page.tsx` | Main debate UI — new conversation starts here |
| `app/debate/[id]/page.tsx` | Load and continue an existing conversation |
| `app/insights/page.tsx` | Insights dashboard — patterns across all debates |
| `app/api/chat/route.ts` | POST: streams Claude response via SSE, saves messages |
| `app/api/conversations/route.ts` | GET: list all; POST: create new conversation |
| `app/api/conversations/[id]/route.ts` | GET: single conversation + messages; DELETE: remove |
| `app/api/verify-passcode/route.ts` | POST: server-side passcode check |
| `app/api/insights/route.ts` | GET: compute and return cross-conversation insights |
| `lib/anthropic.ts` | Anthropic SDK client, system prompt, model constant |
| `lib/prisma.ts` | Prisma client singleton (avoids hot-reload connection leaks) |
| `lib/insights.ts` | Insight computation: topic extraction via Claude, aggregation |
| `components/examined/` | All app-specific UI components (ChatWindow, Sidebar, TopBar, etc.) |
| `components/ui/` | shadcn/ui components — do not edit manually |
| `hooks/use-chat.ts` | Custom hook for streaming chat (SSE parsing, message state) |
| `hooks/use-conversations.ts` | Custom hook for conversation list CRUD |

## Data Flow
1. User types a message in InputBar → `use-chat` hook sends POST to `/api/chat` with `conversationId` and `messageHistory`
2. API route saves user message to DB, sends full history to Claude with system prompt, streams response back via SSE
3. Client receives streamed tokens, displays them in real-time in ChatWindow
4. When stream completes, API route saves assistant message to DB
5. On first message: a second Claude call auto-generates a conversation title
6. Sidebar fetches conversation list from `/api/conversations` on load and after mutations

## External Dependencies

| Dependency | Purpose | Stored in |
|------------|---------|-----------|
| Anthropic API | Claude responses for Socratic dialogue | `.env.local` (`ANTHROPIC_API_KEY`) |
| Railway | PostgreSQL database hosting + deployment | `.env.local` (`DATABASE_URL`) |

## What Not to Touch
- `app/globals.css` — Design system tokens live here. Changes affect the entire app's visual identity, so be deliberate — but plugin imports and minor additions are fine.
- `components/ui/` — Auto-generated shadcn components. Use `pnpm dlx shadcn@latest add` to add new ones.
- `lib/anthropic.ts` system prompt — The core product logic. Changes should be deliberate and discussed.
