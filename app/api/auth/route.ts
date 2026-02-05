import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const SITE_PASSWORD = process.env.SITE_PASSWORD || "admin"
const SESSION_COOKIE = "pdf-host-session"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === SITE_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  return NextResponse.json({
    authenticated: session?.value === "authenticated",
  })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)

  return NextResponse.json({ success: true })
}
