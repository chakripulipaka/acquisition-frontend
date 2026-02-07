'use client'

import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
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
import { CheckCircle2, Upload } from 'lucide-react'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSuccess(true)
    setIsSubmitting(false)

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/')
    }, 2000)
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
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <Card className="border-0 shadow-sm p-8 max-w-md text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Evaluation Submitted
              </h2>
              <p className="text-muted-foreground mb-4">
                Your evaluation for {formData.companyName} has been submitted successfully.
                Redirecting to dashboard...
              </p>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const isFormValid = formData.companyName.trim() && formData.policyFile

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
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
            <Card className="border-0 shadow-sm max-w-2xl rounded-2xl border-l-4 border-l-primary">
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
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload the policy or guideline document (PDF, DOC, DOCX)
                  </p>
                  <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 hover:border-primary/70 transition-colors">
                    <input
                      id="policyFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
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

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t-2 border-t-secondary">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
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
      </div>

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
