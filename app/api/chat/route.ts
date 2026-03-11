import { prisma } from '@/lib/prisma'
import { anthropic, MODEL, SYSTEM_PROMPT } from '@/lib/anthropic'

export async function POST(request: Request) {
  try {
    const { conversationId, message, messageHistory } = await request.json()

    if (!conversationId || !message) {
      return new Response(JSON.stringify({ error: 'Missing conversationId or message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: message,
      },
    })

    // Build message history for Claude
    const messages = [
      ...(messageHistory || []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Stream Claude response via SSE
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const encoder = new TextEncoder()
    let fullResponse = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text
              fullResponse += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }

          // Save assistant message
          await prisma.message.create({
            data: {
              conversationId,
              role: 'assistant',
              content: fullResponse,
            },
          })

          // Update conversation timestamp
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          })

          // Auto-generate title on first message
          const messageCount = await prisma.message.count({
            where: { conversationId },
          })

          if (messageCount <= 2) {
            // First exchange — generate title
            const titleResponse = await anthropic.messages.create({
              model: MODEL,
              max_tokens: 50,
              messages: [
                {
                  role: 'user',
                  content: `Generate a short, philosophical title (max 6 words) for a Socratic debate that starts with this claim: "${message}". Return ONLY the title, no quotes, no explanation.`,
                },
              ],
            })

            const title = titleResponse.content[0].type === 'text'
              ? titleResponse.content[0].text.trim()
              : 'New examination'

            await prisma.conversation.update({
              where: { id: conversationId },
              data: { title },
            })

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ title })}\n\n`))
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error'
          console.error('Stream error:', errMsg, error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
