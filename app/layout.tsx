import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Sora } from 'next/font/google'
import { DocumentsProvider } from '@/contexts/documents-context'
import { EvaluationsProvider } from '@/contexts/evaluations-context'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })
const _sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'Inquire',
  description: 'Inquire - AI-powered corporate research',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={_sora.variable}>
      <body className="font-sans antialiased">
        <DocumentsProvider>
          <EvaluationsProvider>{children}</EvaluationsProvider>
        </DocumentsProvider>
      </body>
    </html>
  )
}

