'use client'

import React, { useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Globe, Calendar, FileText } from 'lucide-react'
import type { Source, SourceHighlight, PolicyGrounding } from '@/lib/types'

interface SourcePreviewDialogProps {
  source?: Source | null
  policyGrounding?: PolicyGrounding | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function renderHighlightedText(text: string, highlights: SourceHighlight[]) {
  if (!highlights.length) {
    return text.split('\n\n').map((para, i) => (
      <p key={i} className="text-sm leading-relaxed text-foreground/80 mb-4 last:mb-0">
        {para}
      </p>
    ))
  }

  const sorted = [...highlights].sort((a, b) => a.startIndex - b.startIndex)
  const segments: { text: string; highlighted: boolean }[] = []
  let cursor = 0

  for (const hl of sorted) {
    if (hl.startIndex > cursor) {
      segments.push({ text: text.slice(cursor, hl.startIndex), highlighted: false })
    }
    segments.push({ text: text.slice(hl.startIndex, hl.endIndex), highlighted: true })
    cursor = hl.endIndex
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false })
  }

  const elements: React.ReactNode[] = []
  let paraKey = 0

  for (const seg of segments) {
    const paras = seg.text.split('\n\n')
    paras.forEach((para, i) => {
      if (i > 0) {
        elements.push(<br key={`br-${paraKey++}`} />)
        elements.push(<br key={`br-${paraKey++}`} />)
      }
      if (seg.highlighted) {
        elements.push(
          <mark
            key={`hl-${paraKey++}`}
            className="bg-amber-200/70 text-foreground px-0.5 rounded-sm"
          >
            {para}
          </mark>
        )
      } else {
        elements.push(<span key={`t-${paraKey++}`}>{para}</span>)
      }
    })
  }

  return (
    <p className="text-sm leading-relaxed text-foreground/80">{elements}</p>
  )
}

export function SourcePreviewDialog({ source, policyGrounding, open, onOpenChange }: SourcePreviewDialogProps) {
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [open])

  if (!source && !policyGrounding) return null

  // Policy grounding mode
  if (policyGrounding) {
    // Use extended context if available, otherwise fall back to single context
    if (policyGrounding.extendedContext) {
      const { pages, highlightPageIndex } = policyGrounding.extendedContext

      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-[50vw] w-[50vw] max-h-[70vh] p-0 gap-0 overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between pr-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">Policy Document</span>
                  </div>
                  {policyGrounding.pageNumber && (
                    <Badge variant="outline" className="text-xs font-medium">
                      Page {policyGrounding.pageNumber}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                  {policyGrounding.documentName}
                </DialogTitle>
                <DialogDescription asChild>
                  <span className="text-xs text-muted-foreground">
                    Showing {pages.length} page{pages.length > 1 ? 's' : ''} of context
                  </span>
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 max-h-[calc(70vh-180px)]">
              <div className="px-6 py-5">
                {pages.map((page, index) => {
                  const isHighlightPage = index === highlightPageIndex
                  const quoteStart = isHighlightPage ? page.content.indexOf(policyGrounding.quote) : -1
                  const highlights: SourceHighlight[] = quoteStart >= 0
                    ? [{ startIndex: quoteStart, endIndex: quoteStart + policyGrounding.quote.length }]
                    : []

                  return (
                    <div key={page.pageNumber}>
                      {index > 0 && (
                        <div className="flex items-center gap-3 my-6">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                            <FileText className="w-3 h-3" />
                            Page {page.pageNumber}
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>
                      )}
                      <div ref={isHighlightPage ? highlightRef : null}>
                        {renderHighlightedText(page.content, highlights)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end">
              <span className="text-xs text-muted-foreground">
                Highlighted text shows the exact requirement from your policy
              </span>
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    // Fallback: single context (old behavior)
    const quoteStart = policyGrounding.context.indexOf(policyGrounding.quote)
    const highlights: SourceHighlight[] = quoteStart >= 0
      ? [{ startIndex: quoteStart, endIndex: quoteStart + policyGrounding.quote.length }]
      : []

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[50vw] w-[50vw] max-h-[70vh] p-0 gap-0 overflow-hidden rounded-2xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between pr-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-primary">Policy Document</span>
                </div>
                {policyGrounding.pageNumber && (
                  <Badge variant="outline" className="text-xs font-medium">
                    Page {policyGrounding.pageNumber}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                {policyGrounding.documentName}
              </DialogTitle>
              <DialogDescription asChild>
                <span className="text-xs text-muted-foreground">
                  Extracted requirement from uploaded policy document
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 max-h-[calc(70vh-180px)]">
            <div className="px-6 py-5">
              <div ref={highlightRef}>
                {renderHighlightedText(policyGrounding.context, highlights)}
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end">
            <span className="text-xs text-muted-foreground">
              Highlighted text shows the exact requirement from your policy
            </span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Web source mode (original behavior)
  if (!source) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50vw] w-[50vw] max-h-[70vh] p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between pr-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm font-semibold text-secondary">{source.publisher}</span>
              </div>
              <div className="flex items-center gap-3">
                {source.pageNumber && (
                  <Badge variant="outline" className="text-xs font-medium">
                    Page {source.pageNumber}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(source.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-foreground leading-tight">
              {source.name}
            </DialogTitle>
            <DialogDescription asChild>
              <span className="text-xs text-muted-foreground truncate block">
                {source.url}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 max-h-[calc(70vh-180px)]">
          <div className="px-6 py-5">
            {renderHighlightedText(source.excerptText, source.highlights)}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-secondary border-secondary/30 hover:bg-secondary/5"
            onClick={() => window.open(source.url, '_blank', 'noopener,noreferrer')}
          >
            Open Original
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
