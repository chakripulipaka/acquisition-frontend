'use client'

import React from "react"

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
import { CheckCircle2 } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    policy: '',
    industry: '',
  })

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

  const isFormValid = formData.companyName.trim() && formData.policy.trim()

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
                Provide company details and guidelines for risk assessment
              </p>
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-sm max-w-2xl">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-foreground font-semibold">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="bg-white"
                    required
                  />
                </div>

                {/* Company Website */}
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite" className="text-foreground font-semibold">
                    Company Website
                  </Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                {/* Industry Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground font-semibold">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={handleIndustryChange}>
                    <SelectTrigger id="industry" className="bg-white">
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

                {/* Policy/Guideline Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="policy" className="text-foreground font-semibold">
                    Policy / Guideline *
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provide relevant policies, financial guidelines, or specific evaluation criteria
                  </p>
                  <Textarea
                    id="policy"
                    name="policy"
                    placeholder="Enter company policy or evaluation guidelines..."
                    value={formData.policy}
                    onChange={handleInputChange}
                    className="bg-white min-h-[200px]"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex-1"
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
            <div className="mt-8 max-w-2xl bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Note:</span> Your evaluation will be processed
                and you'll receive a comprehensive risk assessment report within 24 hours.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
