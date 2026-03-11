import { prisma } from './prisma'
import { anthropic, MODEL } from './anthropic'

export interface Insight {
  type: 'belief_challenged' | 'recurring_topic' | 'position_shift'
  label: string
  count: number
  lastSeen: Date
}

export async function computeInsights(): Promise<Insight[]> {
  // Fetch all conversations with their messages
  const conversations = await prisma.conversation.findMany({
    where: { userId: 'default_user' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (conversations.length === 0) {
    return []
  }

  // Build a summary of all conversations for Claude to analyze
  const conversationSummaries = conversations.map((c) => {
    const messagePreview = c.messages
      .slice(0, 6)
      .map((m) => `${m.role}: ${m.content.slice(0, 200)}`)
      .join('\n')
    return `Title: ${c.title || 'Untitled'}\nDate: ${c.createdAt.toISOString()}\nSummary: ${c.summary || 'No summary'}\nMessages:\n${messagePreview}`
  }).join('\n\n---\n\n')

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You analyze Socratic debate conversations and extract insights. Return valid JSON only, no markdown.`,
    messages: [
      {
        role: 'user',
        content: `Analyze these ${conversations.length} Socratic debate conversations and extract insights.

Return a JSON array of objects with this shape:
{ "type": "belief_challenged" | "recurring_topic" | "position_shift", "label": "short description", "count": number }

- "belief_challenged": beliefs that were probed hardest or where the user's reasoning had gaps
- "recurring_topic": themes or subjects that appear across multiple conversations
- "position_shift": cases where the user's stance visibly changed during a conversation

Return 3-8 insights total. Be specific in labels (not generic). Return ONLY the JSON array.

Conversations:
${conversationSummaries}`,
      },
    ],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  const text = rawText.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

  try {
    const parsed = JSON.parse(text) as Array<{ type: string; label: string; count: number }>
    const now = new Date()

    // Update cache
    await prisma.insightsCache.deleteMany({ where: { userId: 'default_user' } })

    const insights: Insight[] = parsed.map((item) => ({
      type: item.type as Insight['type'],
      label: item.label,
      count: item.count,
      lastSeen: now,
    }))

    // Save to cache
    for (const insight of insights) {
      await prisma.insightsCache.create({
        data: {
          type: insight.type,
          label: insight.label,
          count: insight.count,
          lastSeen: insight.lastSeen,
          userId: 'default_user',
        },
      })
    }

    return insights
  } catch (e) {
    console.error('Failed to parse insights from Claude:', e, 'Raw response:', rawText)
    const cached = await prisma.insightsCache.findMany({
      where: { userId: 'default_user' },
      orderBy: { count: 'desc' },
    })
    return cached.map((c) => ({
      type: c.type as Insight['type'],
      label: c.label,
      count: c.count,
      lastSeen: c.lastSeen,
    }))
  }
}
