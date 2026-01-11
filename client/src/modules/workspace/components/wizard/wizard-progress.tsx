import { cn } from "@/shared/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function WizardProgress({ currentStep, totalSteps, className }: WizardProgressProps) {
  return (
    <div className={cn("flex flex-col gap-2 mb-8", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">
            Step {currentStep} of {totalSteps}
        </span>
        <span className="text-muted-foreground text-xs">
            {Math.round((currentStep / totalSteps) * 100)}% completed
        </span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
