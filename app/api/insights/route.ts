import { NextResponse } from 'next/server'
import { computeInsights } from '@/lib/insights'

export async function GET() {
  try {
    const insights = await computeInsights()
    return NextResponse.json(insights)
  } catch (error) {
    console.error('Failed to compute insights:', error)
    return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500 })
  }
}
