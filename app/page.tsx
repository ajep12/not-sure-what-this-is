"use client"

import { useEffect, useState, useCallback } from "react"
import { PDFUploader } from '@/components/pdf-uploader'
import { PDFList } from '@/components/pdf-list'

interface PDF {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

export default function Home() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchPdfs = useCallback(async () => {
    try {
      const response = await fetch('/api/pdfs')
      if (response.ok) {
        const data = await response.json()
        setPdfs(data.pdfs)
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPdfs()
  }, [fetchPdfs])

  const handleDelete = async (url: string) => {
    setIsDeleting(url)
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        setPdfs((prev) => prev.filter((pdf) => pdf.url !== url))
      } else {
        alert('Failed to delete PDF')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete PDF')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">PDF Host</h1>
        <p className="mt-1 text-muted-foreground">
          Upload and manage your PDF files
        </p>
      </div>

      <div className="mb-8">
        <PDFUploader onUploadComplete={fetchPdfs} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Your PDFs</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : (
          <PDFList pdfs={pdfs} onDelete={handleDelete} isDeleting={isDeleting} />
        )}
      </div>
    </main>
  )
}
