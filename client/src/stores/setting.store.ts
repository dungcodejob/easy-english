import { create } from 'zustand';
import { Language } from '../types';

type SettingStore = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useSettingStore = create<SettingStore>((set) => ({
  language: Language.Default,
  setLanguage: (language: Language) => set({ language }),
}));

export const useLanguage = () => {
  return useSettingStore((state) => state.language);
};

export const useSetLanguage = () => {
  return useSettingStore((state) => state.setLanguage);
};
