import { Language } from '../types/workspace.types';

export interface LanguageOption {
  code: Language;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 country code for flag
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: Language.EN, name: 'English', countryCode: 'US' },
  { code: Language.ES, name: 'Spanish', countryCode: 'ES' },
  { code: Language.FR, name: 'French', countryCode: 'FR' },
  { code: Language.DE, name: 'German', countryCode: 'DE' },
  { code: Language.JA, name: 'Japanese', countryCode: 'JP' },
  { code: Language.KO, name: 'Korean', countryCode: 'KR' },
  { code: Language.ZH, name: 'Chinese', countryCode: 'CN' },
  { code: Language.VI, name: 'Vietnamese', countryCode: 'VN' },
];
