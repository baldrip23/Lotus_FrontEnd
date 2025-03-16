import { create } from 'zustand';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const languageNames: Record<Language, string> = {
  'en': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'zh-HK': '廣東話'
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));