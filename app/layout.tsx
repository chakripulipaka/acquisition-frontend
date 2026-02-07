import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Sora } from 'next/font/google'
import { DocumentsProvider } from '@/contexts/documents-context'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })
const _sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={_sora.variable}>
      <body className="font-sans antialiased">
        <DocumentsProvider>{children}</DocumentsProvider>
      </body>
    </html>
  )
}

