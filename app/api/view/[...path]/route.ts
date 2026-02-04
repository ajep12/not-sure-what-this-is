import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const filename = path.join("/")

    // Find the blob by filename
    const { blobs } = await list()
    const blob = blobs.find(
      (b) => b.pathname === filename || b.pathname.endsWith(`/${filename}`)
    )

    if (!blob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Fetch the PDF from blob storage
    const response = await fetch(blob.url)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
    }

    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("View error:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
