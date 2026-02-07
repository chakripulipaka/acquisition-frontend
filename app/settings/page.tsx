'use client'

import React from 'react'
import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useDocuments } from '@/contexts/documents-context'
import { Upload, Trash2, FileText } from 'lucide-react'

export default function SettingsPage() {
  const { documents, addDocument, removeDocument } = useDocuments()
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addDocument(file)
      setFileName(file.name)
      // Reset input
      e.target.value = ''
      setFileName('')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[74%] mx-auto">
{/* Policy Documents Section */}
          <Card className="rounded-2xl shadow-sm border-l-4 border-l-secondary p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Policy Documents</h2>
              <p className="text-muted-foreground">
                Upload policy or guideline documents to reuse across all evaluations. These documents will be available as pre-loaded options when creating new evaluations.
              </p>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              <Label className="text-foreground font-semibold text-secondary mb-3 block">
                Upload New Document
              </Label>
              <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 hover:border-primary/70 transition-colors">
                <input
                  id="policyFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="policyFile"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-primary mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Drag and drop your document here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </label>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Uploaded Documents ({documents.length})
              </h3>
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{doc.name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{formatFileSize(doc.size)}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed border-border">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a document to get started
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Info Box */}
          <Card className="rounded-2xl shadow-sm bg-secondary/5 border-l-4 border-l-secondary p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-secondary">Tip:</span> Documents uploaded here will be automatically available when you create a new evaluation. You can still upload additional documents per evaluation if needed.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
