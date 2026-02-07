'use client'

import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CheckCircle2, Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { useDocuments } from '@/contexts/documents-context'
import { useEvaluations } from '@/contexts/evaluations-context'
import { generateFakeEvaluation } from '@/lib/mock-data'

const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Energy',
  'Real Estate',
  'Transportation',
  'Telecommunications',
  'Other',
]

export default function EvaluationPage() {
  const router = useRouter()
  const { documents } = useDocuments()
  const { addEvaluation } = useEvaluations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [resultSummary, setResultSummary] = useState({ categories: 0, items: 0 })
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [useStoredDocument, setUseStoredDocument] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    industry: '',
    additionalInfo: '',
    policyFile: null as File | null,
  })
  const [fileName, setFileName] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        policyFile: file,
      }))
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Validate a file is selected
      const hasFile = formData.policyFile || useStoredDocument
      if (!hasFile) {
        throw new Error('Please select a policy document to upload.')
      }

      // Step 1: Simulate upload + rubric generation
      setProgressMessage('Uploading document and generating rubric...')
      await new Promise((r) => setTimeout(r, 1500))

      // Step 2: Simulate evaluation
      setProgressMessage('Running company evaluation...')
      await new Promise((r) => setTimeout(r, 2000))

      // Step 3: Generate fake evaluation data
      setProgressMessage('Analyzing compliance data and sources...')
      await new Promise((r) => setTimeout(r, 1000))

      const fakeEval = generateFakeEvaluation(formData.companyName, {
        website: formData.companyWebsite,
        industry: formData.industry,
        additionalInfo: formData.additionalInfo,
      })

      // Step 4: Add to shared evaluations context
      addEvaluation(fakeEval)

      setResultSummary({
        categories: fakeEval.evaluation_results?.[0]?.rubric_results?.yourPolicyConcerns?.length ?? 0,
        items: 0,
      })
      setIsSuccess(true)
      setIsSubmitting(false)

      setTimeout(() => {
        router.push(`/company/${fakeEval.id}`)
      }, 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
      setErrorMessage(message)
      setIsSubmitting(false)
      setProgressMessage('')
    }
  }

  const handleCancelClick = () => {
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    router.push('/')
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <Card className="border-0 shadow-sm p-8 max-w-md text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Evaluation Complete
            </h2>
            <p className="text-muted-foreground mb-2">
              Your evaluation for <span className="font-semibold">{formData.companyName}</span> has been generated successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {resultSummary.categories} policy categories analyzed.
              Redirecting to results...
            </p>
          </Card>
        </main>
      </div>
    )
  }

  const isFormValid =
    formData.companyName.trim() && (formData.policyFile || useStoredDocument)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-[74%] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                New Evaluation
              </h1>
              <p className="text-muted-foreground">
                Provide company details and policy guidelines for evaluation
              </p>
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-sm max-w-2xl mx-auto rounded-2xl border-l-4 border-l-primary">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-foreground font-semibold text-primary">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="bg-white border-2 border-secondary/30 focus:border-secondary"
                    required
                  />
                </div>

                {/* Company Website */}
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite" className="text-foreground font-semibold text-secondary">
                    Company Website
                  </Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="bg-white border-2 border-secondary/30 focus:border-secondary"
                  />
                </div>

                {/* Industry Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground font-semibold text-primary">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={handleIndustryChange}>
                    <SelectTrigger id="industry" className="bg-white border-2 border-secondary/30 focus:border-secondary">
                      <SelectValue placeholder="Select an industry (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-foreground font-semibold text-secondary">
                    Additional Information
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provide any additional details about the company to help identify and retrieve information
                  </p>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Enter any additional information about the company..."
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    className="bg-white min-h-[120px] border-2 border-secondary/30 focus:border-secondary"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="policyFile" className="text-foreground font-semibold text-primary">
                    Policy / Guideline Document *
                  </Label>
                  
                  {/* Saved Documents List */}
                  {documents.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-secondary/20">
                      <p className="text-sm font-medium text-secondary mb-3">Previously Uploaded Documents</p>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setUseStoredDocument(doc.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              useStoredDocument === doc.id
                                ? 'bg-secondary/10 border-secondary'
                                : 'bg-white border-secondary/30 hover:border-secondary'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className={`w-4 h-4 ${useStoredDocument === doc.id ? 'text-secondary' : 'text-muted-foreground'}`} />
                              <span className="text-sm font-medium text-foreground">{doc.name}</span>
                            </div>
                            {useStoredDocument === doc.id && (
                              <span className="text-xs font-semibold text-secondary">Selected</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-3">
                    {useStoredDocument ? 'Or upload a new document' : 'Upload the policy or guideline document (PDF, DOC, DOCX, TXT)'}
                  </p>
                  <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 hover:border-primary/70 transition-colors">
                    <input
                      id="policyFile"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="policyFile"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-primary mb-2" />
                      {fileName ? (
                        <>
                          <p className="text-sm font-medium text-foreground">{fileName}</p>
                          <p className="text-xs text-muted-foreground">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-foreground">
                            Drag and drop your file here
                          </p>
                          <p className="text-xs text-muted-foreground">or click to browse</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Evaluation failed</p>
                      <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Progress Message */}
                {isSubmitting && progressMessage && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                    <p className="text-sm text-blue-700">{progressMessage}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t-2 border-t-secondary">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
                    disabled={isSubmitting}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? 'Running Evaluation...' : 'Run Evaluation'}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Info Box */}
            <div className="mt-8 max-w-2xl bg-secondary/5 border-l-4 border-l-secondary rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-secondary">Note:</span> Your evaluation will be processed
                and you'll receive a comprehensive assessment report within 24 hours.
              </p>
            </div>
          </div>
        </main>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Evaluation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you'd like to exit? Any unsaved information will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Exit
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
