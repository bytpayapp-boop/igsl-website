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
import type { BirthCertificateFormData } from '@/lib/types'

interface BirthCertificateFormProps {
  onSubmit?: (data: BirthCertificateFormData) => void
}

export function BirthCertificateForm({ onSubmit }: BirthCertificateFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<BirthCertificateFormData>>({
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
      if (!formData.childFullName || !formData.dateOfBirth || !formData.placeOfBirth) {
        toast.error('Please fill in all required fields')
        return false
      }
    } else if (step === 2) {
      if (!formData.fatherName || !formData.motherName) {
        toast.error('Please fill in all required fields')
        return false
      }
    } else if (step === 3) {
      if (!formData.residentialAddress || !formData.ward) {
        toast.error('Please fill in all required fields')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    sessionStorage.clear();
    e.preventDefault()

    if (step < 4) {
      if (validateStep()) {
        setStep(step + 1)
      }
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

     
      
      if (onSubmit) {
        onSubmit(formData as BirthCertificateFormData)
      } else {
        sessionStorage.setItem('applicationData', JSON.stringify(formData))
        router.push('/payment/summary?type=birth-certificate')
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
          Step {step} of 4: {step === 1 && 'Child Information'}
          {step === 2 && 'Parent Information'}
          {step === 3 && 'Address & Ward'}
          {step === 4 && 'Review & Declare'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Birth Certificate Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Child Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childFullName">Child&apos;s Full Name *</Label>
                  <Input
                    id="childFullName"
                    name="childFullName"
                    value={formData.childFullName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter child's full name"
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
                  <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                  <Input
                    id="placeOfBirth"
                    name="placeOfBirth"
                    value={formData.placeOfBirth || ''}
                    onChange={handleInputChange}
                    placeholder="City/Town/Hospital"
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
              </div>
            )}

            {/* Step 2: Parent Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fatherName">Father&apos;s Full Name *</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fatherOccupation">Father&apos;s Occupation</Label>
                  <Input
                    id="fatherOccupation"
                    name="fatherOccupation"
                    value={formData.fatherOccupation || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Farmer, Teacher, Trader"
                  />
                </div>

                <div>
                  <Label htmlFor="motherName">Mother&apos;s Full Name *</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={formData.motherName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter mother's name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="motherOccupation">Mother&apos;s Occupation</Label>
                  <Input
                    id="motherOccupation"
                    name="motherOccupation"
                    value={formData.motherOccupation || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Farmer, Teacher, Trader"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="residentialAddress">Residential Address *</Label>
                  <Textarea
                    id="residentialAddress"
                    name="residentialAddress"
                    value={formData.residentialAddress || ''}
                    onChange={handleInputChange}
                    placeholder="Enter complete residential address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ward">Ward *</Label>
                  <Select value={formData.ward || ''} onValueChange={(value) => handleSelectChange('ward', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'Alor-Agu',
                        'Amebo/Hausa/Yoruba',
                        'Ezema Ward',
                        'Echara/Isiagu Ward',
                        'Iheaka (Ugo Akoyi)',
                        'Iheaka (Likki/Akutara Ward)',
                        'Iheakpu (Ezzi Ngwu Ward)',
                        'Iheakpu (Ajuona Ogbagu Ward)',
                        'Itchi/Uwani I',
                        'Itchi/Uwani II',
                        'Nkalagu Obukpa',
                        'Ovoko (Ajuona Ward)',
                        'Ovoko (Umuelo/Ovoko Agu Ward)',
                        'Ovoko (Umulolo Ward)',
                        'Uhunowerre',
                        'Unadu'
                      ].map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <span className="font-medium">Child&apos;s Name:</span> {formData.childFullName}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium">Place of Birth:</span> {formData.placeOfBirth}
                    </p>
                    <p>
                      <span className="font-medium">Father:</span> {formData.fatherName}
                    </p>
                    <p>
                      <span className="font-medium">Mother:</span> {formData.motherName}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {formData.residentialAddress}
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
                    <label htmlFor="declaration" className="dark:text-gray-500 cursor-pointer">
                      I hereby declare that the above information is true and correct to the best of my
                      knowledge. I understand that providing false information is an offense under the law.
                    </label>
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="font-semibold text-gray-300 mb-1">Application Fee: NGN 3,500</p>
                  <p className="text-sm text-foreground/70">
                    Processing time: 3-5 business days
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
