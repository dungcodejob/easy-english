import { Card, CardContent } from '@/shared/ui/shadcn/card';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useCreateWorkspace } from '../../hooks/create-workspace';
import type { CreateWorkspaceWizardData } from '../../types/workspace.types';
import { WorkspaceBasicsStep } from './steps/workspace-basics-step';
import { WorkspaceLearningStep } from './steps/workspace-learning-step';
import { WorkspacePreferencesStep } from './steps/workspace-preferences-step';
import { WorkspaceReviewStep } from './steps/workspace-review-step';
import { WizardProgress } from './wizard-progress';

export function WorkspaceWizard() {
  const navigate = useNavigate();
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<CreateWorkspaceWizardData>>({});

  const totalSteps = 4;

  const handleNext = (stepData: Partial<CreateWorkspaceWizardData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      if (!data.name || !data.language) return;

      // Only send backend-compatible fields
      await createWorkspace({
        name: data.name,
        description: data.description,
        language: data.language,
      });

      // TODO: Persist extra fields (learningGoal, level, preferences) 
      // either in localStorage or a separate settings endpoint once available.
      
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
        <CardContent className="p-0 sm:p-6">
          <WizardProgress currentStep={step} totalSteps={totalSteps} className="mb-8" />

          {step === 1 && (
            <WorkspaceBasicsStep 
                defaultValues={data} 
                onNext={handleNext} 
            />
          )}

          {step === 2 && (
            <WorkspaceLearningStep 
                defaultValues={data} 
                onNext={handleNext} 
                onBack={handleBack} 
            />
          )}

          {step === 3 && (
            <WorkspacePreferencesStep 
                defaultValues={data} 
                onNext={handleNext} 
                onBack={handleBack}
                onSkip={() => setStep(4)} 
            />
          )}

          {step === 4 && (
            <WorkspaceReviewStep 
                data={data} 
                onBack={handleBack} 
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
