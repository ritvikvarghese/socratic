import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json()
    const success = passcode === process.env.PASSCODE
    return NextResponse.json({ success })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
