# Socratic

A single-user AI debate tool that challenges your beliefs using the Socratic method. Submit a belief, principle, or thesis — Claude will question your assumptions until the idea either strengthens or falls apart.

## How It Works

1. Start a new debate by entering a belief
2. Claude responds with probing Socratic questions
3. The conversation continues until the idea is thoroughly examined
4. Review past debates and insights from the sidebar

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Anthropic Claude API with streaming responses
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Deployment:** Railway

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file and fill in your values
cp .env.example .env.local

# Run database migrations
pnpm prisma migrate deploy

# Start dev server
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `DATABASE_URL` | PostgreSQL connection string |
| `PASSCODE` | Passcode to access the app |

## License

MIT
