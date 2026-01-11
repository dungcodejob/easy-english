import { cn } from "@/shared/utils";
import type { ReactNode } from "react";

interface WizardStepLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function WizardStepLayout({ title, description, children, className }: WizardStepLayoutProps) {
  return (
    <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", className)}>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        )}
      </div>
      
      <div className="py-2">
        {children}
      </div>
    </div>
  );
}
