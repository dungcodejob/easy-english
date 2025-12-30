import { cn } from '@/shared/utils';
import * as FlagIcons from 'country-flag-icons/react/3x2';
import { Check } from 'lucide-react';
import { LANGUAGE_OPTIONS, type LanguageOption } from '../constants/language-data';
import type { Language } from '../types/workspace.types';

interface LanguagePickerProps {
  value?: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}

export function LanguagePicker({ value, onChange, disabled = false }: LanguagePickerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {LANGUAGE_OPTIONS.map((language) => (
          <LanguageCard
            key={language.code}
            language={language}
            isSelected={value === language.code}
            onSelect={() => onChange(language.code)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

interface LanguageCardProps {
  language: LanguageOption;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function LanguageCard({ language, isSelected, onSelect, disabled = false }: LanguageCardProps) {
  // Dynamically get the flag component
  const FlagComponent = FlagIcons[language.countryCode as keyof typeof FlagIcons];

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 transition-all',
        'hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isSelected
          ? 'border-primary bg-linear-to-br from-primary/10 to-primary/5 shadow-md'
          : 'border-border bg-background shadow-sm hover:border-primary/50',
        disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
      )}
      aria-pressed={isSelected}
      aria-label={`Select ${language.name}`}
    >
      {/* Check icon for selected state */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </div>
      )}

      {/* SVG Flag */}
      {FlagComponent && (
        <div className="h-12 w-[4.5rem] overflow-hidden rounded shadow-sm">
          <FlagComponent className="h-full w-full object-cover" title={`${language.name} flag`} />
        </div>
      )}

      {/* Language name */}
      <span className="text-sm font-medium text-foreground">{language.name}</span>
    </button>
  );
}
