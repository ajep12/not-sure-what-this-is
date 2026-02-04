'use client'

import { FileText, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PDF {
  url: string
  blobUrl: string
  filename: string
  size: number
  uploadedAt: string
}

interface PDFListProps {
  pdfs: PDF[]
  onDelete: (url: string) => void
  isDeleting: string | null
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function PDFList({ pdfs, onDelete, isDeleting }: PDFListProps) {
  if (pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No PDFs yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your first PDF to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {pdfs.map((pdf) => (
        <Card key={pdf.url} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium" title={pdf.filename}>
                {pdf.filename}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(pdf.size)} · {formatDate(pdf.uploadedAt)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(pdf.blobUrl)}
                disabled={isDeleting === pdf.blobUrl}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete {pdf.filename}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
