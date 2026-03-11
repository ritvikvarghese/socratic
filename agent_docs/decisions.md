# Decisions

Key decisions made and why. Read this every session.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Keep Next.js 16 (not downgrade to 14 as in PLAN.md)
**Context / trigger:** The frontend was built with Next.js 16, shadcn/ui v4, and Tailwind CSS 4. PLAN.md references Next.js 14 but the actual implementation uses 16.
**Alternatives considered:** Downgrading to Next.js 14 — rejected because it would break shadcn v4 + Tailwind 4 compatibility.
**Why:** The frontend already works on Next.js 16. Fighting the framework version would create more problems than it solves.
**Consequences:** Some Next.js 14 patterns from PLAN.md may need slight adjustments for v16 APIs.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Use pnpm as package manager
**Context / trigger:** The frontend ships with `pnpm-lock.yaml`.
**Alternatives considered:** npm (PLAN.md default), yarn — rejected to stay consistent with the existing lockfile.
**Why:** Switching package managers would regenerate the lockfile and potentially cause version mismatches.
**Consequences:** All commands use `pnpm` instead of `npm`. Agent docs updated accordingly.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Use personalized SYSTEM_PROMPT.md (not PLAN.md Section 6 generic prompt)
**Context / trigger:** Ritvik created a detailed, personalized system prompt in `~/Downloads/SYSTEM_PROMPT.md` that knows his thinking patterns, biases, and principles.
**Alternatives considered:** The generic Socratic prompt from PLAN.md Section 6.
**Why:** The personalized prompt is the core product differentiator — it makes the tool genuinely useful for Ritvik specifically.
**Consequences:** The system prompt in `lib/anthropic.ts` is longer and more specific. It references Ritvik by name.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Scaffold database schema now, connect later
**Context / trigger:** Railway PostgreSQL not yet provisioned. Need Prisma schema for type generation but can't run migrations yet.
**Alternatives considered:** Wait until Railway DB is ready to add any DB code — rejected because we need types for API routes.
**Why:** Having the schema and Prisma client lets us write type-safe API routes now. Migrations run once DATABASE_URL is set.
**Consequences:** `pnpm prisma generate` works for types. `pnpm prisma migrate dev` deferred until DATABASE_URL is set.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Keep "Socratic" branding (not "Examined")
**Context / trigger:** The frontend uses "Socratic" in TopBar, ChatWindow empty state, and metadata.
**Alternatives considered:** Renaming to "Examined" as referenced in some docs.
**Why:** The frontend is already built with "Socratic" branding. No need to change what works.
**Consequences:** System prompt still references "Examined" internally — that's fine, it's the AI persona name.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Use Cormorant Garamond (not Playfair Display) for serif font
**Context / trigger:** The frontend already uses Cormorant Garamond. PLAN.md mentions Playfair Display.
**Alternatives considered:** Switching to Playfair Display — rejected because the current font works well with the design.
**Why:** Keep what's already implemented and looks good.
**Consequences:** None — design is consistent.

---

**Date:** 2026-03-11
**Status:** Accepted
**Decision:** Switch from Supabase + Vercel to Railway for both database and deployment
**Context / trigger:** Supabase JS client was added but never imported by any app code — Prisma handles all DB access. Vercel Analytics was in layout but unused. Simplifying infrastructure.
**Alternatives considered:** Keep Supabase for DB hosting + Vercel for deployment — rejected because Railway provides both PostgreSQL and container deployment in one platform, reducing complexity.
**Why:** Fewer moving parts. Railway gives us PostgreSQL + Docker deployment in one dashboard. The Supabase client was dead code. Vercel Analytics added no value.
**Consequences:** Removed `@supabase/supabase-js`, `@vercel/analytics`, and `lib/supabase.ts`. Added `Dockerfile` and `output: 'standalone'` to Next.js config. All env vars simplified to `ANTHROPIC_API_KEY`, `DATABASE_URL`, `PASSCODE`.
