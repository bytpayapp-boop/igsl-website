import { Check } from 'lucide-react'

interface Step {
  id: number
  label: string
  description: string
}

interface FormStepperProps {
  steps: Step[]
  currentStep: number
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all ${
                currentStep > step.id
                  ? 'bg-accent text-primary'
                  : currentStep === step.id
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-foreground/40'
              }`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id + 1}
            </div>

            {/* Step Label */}
            <div className="text-center">
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-foreground/50'
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-foreground/50 mt-1">{step.description}</p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-full h-1 mt-4 transition-all ${
                  currentStep > step.id ? 'bg-accent' : 'bg-muted'
                }`}
                style={{
                  position: 'absolute',
                  width: `calc(100% / ${steps.length} - 20px)`,
                  marginLeft: `calc(5px + 100% / ${steps.length * 2})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="relative mt-8 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
