import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: 'default_user' },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    })

    const result = conversations.map((c) => ({
      id: c.id,
      title: c.title,
      summary: c.summary,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      firstMessage: c.messages[0]?.content?.slice(0, 100) ?? null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId: 'default_user',
      },
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Failed to create conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
