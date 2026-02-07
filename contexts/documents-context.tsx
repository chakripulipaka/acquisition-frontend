'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_DOCUMENTS } from '@/lib/mock-data'

export interface StoredDocument {
  id: string
  name: string
  size: number
  uploadedAt: string
  file?: File
}

interface DocumentsContextType {
  documents: StoredDocument[]
  addDocument: (file: File) => void
  removeDocument: (id: string) => void
  getDocuments: () => StoredDocument[]
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<StoredDocument[]>([])

  // Seed with mock documents on mount, merge with any localStorage data
  useEffect(() => {
    const stored = localStorage.getItem('policyDocuments')
    let userDocs: StoredDocument[] = []
    if (stored) {
      try {
        userDocs = JSON.parse(stored)
      } catch (error) {
        console.log('[v0] Error loading documents:', error)
      }
    }
    // Combine mock docs + user-uploaded docs (avoid duplicates by id)
    const mockIds = new Set(MOCK_DOCUMENTS.map((d) => d.id))
    const filteredUserDocs = userDocs.filter((d) => !mockIds.has(d.id))
    setDocuments([...MOCK_DOCUMENTS, ...filteredUserDocs])
  }, [])

  // Save only user-uploaded documents to localStorage
  useEffect(() => {
    const mockIds = new Set(MOCK_DOCUMENTS.map((d) => d.id))
    const userDocs = documents.filter((d) => !mockIds.has(d.id))
    if (userDocs.length > 0) {
      localStorage.setItem('policyDocuments', JSON.stringify(userDocs))
    }
  }, [documents])

  const addDocument = (file: File) => {
    const newDoc: StoredDocument = {
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleDateString(),
      file,
    }
    setDocuments((prev) => [...prev, newDoc])
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDocuments = () => documents

  return (
    <DocumentsContext.Provider value={{ documents, addDocument, removeDocument, getDocuments }}>
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within DocumentsProvider')
  }
  return context
}
