# JavaScript / TypeScript Practices

Universal JavaScript/TypeScript standards for Ritvik's projects.
Read this at the start of any JavaScript session.

---
## Environment
- Always check Node version before starting: `node --version`
- Use **pnpm** for package management (not npm or yarn)
- Add `node_modules/` to `.gitignore`
- This project uses Next.js 16, React 19, TypeScript 5.7

## Code Style
- Prefer `const` over `let`, never use `var`
- Use async/await over raw Promises for readability
- Add a one-line comment above any non-obvious logic
- Keep functions small and single-purpose
- Use TypeScript types — avoid `any` unless truly necessary

## Secrets & Environment Variables
- Environment variables go in `.env.local` (never committed)
- Never hardcode API keys or credentials
- Server-only secrets accessed via `process.env` in API routes
- Client-safe values prefixed with `NEXT_PUBLIC_`

## Error Handling
- Always use try/catch with async/await
- Log errors with a clear human-readable message
- Never let errors fail silently
- API routes should return proper HTTP status codes with error messages

## Next.js Conventions
- Use App Router (`app/` directory)
- Server components by default, add `"use client"` only when needed
- API routes in `app/api/` using `route.ts` files
- Use `lib/` for shared utilities and clients

## Lessons Learned
[Add JavaScript/TypeScript-specific lessons here as you encounter them across projects]
