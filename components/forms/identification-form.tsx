'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { IdentificationFormData } from '@/lib/types'

interface IdentificationFormProps {
  onSubmit?: (data: IdentificationFormData) => void
}

export function IdentificationForm({ onSubmit }: IdentificationFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<IdentificationFormData>>({
    gender: 'male',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value as any }))
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.dateOfBirth || !formData.phone || !formData.email) {
        toast.error('Please fill in all required fields')
        return false
      }
    } else if (step === 2) {
      if (!formData.residentialAddress || !formData.ward) {
        toast.error('Please fill in all required fields')
        return false
      }
    } else if (step === 3) {
      if (!formData.kinName || !formData.kinRelationship || !formData.kinPhone) {
        toast.error('Please fill in all required fields')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 4) {
      if (validateStep()) {
        setStep(step + 1)
      }
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSubmit) {
        onSubmit(formData as IdentificationFormData)
      } else {
        // Store in session and redirect to payment
        sessionStorage.setItem('applicationData', JSON.stringify(formData))
        router.push('/payment/summary?type=identification')
      }
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                } ${s < 4 ? 'mr-2' : ''}`}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground/70">
          Step {step} of 4: {step === 1 && 'Personal Information'}
          {step === 2 && 'Address Details'}
          {step === 3 && 'Family Information'}
          {step === 4 && 'Review & Declare'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Local Government Identification Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Gender *</Label>
                  <RadioGroup value={formData.gender || 'male'} onValueChange={handleRadioChange}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal cursor-pointer">
                          Other
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="residentialAddress">Residential Address *</Label>
                  <Textarea
                    id="residentialAddress"
                    name="residentialAddress"
                    value={formData.residentialAddress || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your complete residential address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ward">Ward *</Label>
                  <Select value={formData.ward || ''} onValueChange={(value) => handleSelectChange('ward', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={`Ward ${i + 1}`}>
                          Ward {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Family Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kinName">Kin/Family Member Name *</Label>
                  <Input
                    id="kinName"
                    name="kinName"
                    value={formData.kinName || ''}
                    onChange={handleInputChange}
                    placeholder="Name of kin or family member"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="kinRelationship">Relationship *</Label>
                  <Input
                    id="kinRelationship"
                    name="kinRelationship"
                    value={formData.kinRelationship || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Parent, Spouse, Sibling"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="kinPhone">Kin Phone Number *</Label>
                  <Input
                    id="kinPhone"
                    name="kinPhone"
                    type="tel"
                    value={formData.kinPhone || ''}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Declare */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Application Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {formData.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {formData.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {formData.residentialAddress}
                    </p>
                    <p>
                      <span className="font-medium">Ward:</span> {formData.ward}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-foreground">
                    <input
                      type="checkbox"
                      id="declaration"
                      className="mr-2"
                      required
                    />
                    <label htmlFor="declaration" className="cursor-pointer">
                      I hereby declare that the information provided above is true and correct. I
                      understand that providing false information is an offense.
                    </label>
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="font-semibold text-primary mb-1">Application Fee: NGN 5,000</p>
                  <p className="text-sm text-foreground/70">
                    Processing time: 5-7 business days
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : step === 4 ? 'Proceed to Payment' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
