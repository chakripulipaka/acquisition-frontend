'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface StoredDocument {
  id: string
  name: string
  size: number
  uploadedAt: string
  file: File
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

  // Load documents from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('policyDocuments')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setDocuments(parsed)
      } catch (error) {
        console.log('[v0] Error loading documents:', error)
      }
    }
  }, [])

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('policyDocuments', JSON.stringify(documents))
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
