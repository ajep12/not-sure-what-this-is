import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list()

    // Filter only PDF files
    const pdfs = blobs
      .filter((blob) => blob.pathname.toLowerCase().endsWith('.pdf'))
      .map((blob) => ({
        url: blob.url,
        filename: blob.pathname.split('/').pop() || 'unknown.pdf',
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }))

    return NextResponse.json({ pdfs })
  } catch (error) {
    console.error('Error listing PDFs:', error)
    return NextResponse.json({ error: 'Failed to list PDFs' }, { status: 500 })
  }
}
