import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  aiMemory: boolean;
  notifications: boolean;
  language: 'en' | 'zh';
  toggleAiMemory: () => void;
  toggleNotifications: () => void;
  setLanguage: (lang: 'en' | 'zh') => void;
  clearAiMemory: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      aiMemory: true,
      notifications: true,
      language: 'en',
      toggleAiMemory: () => set((state) => ({ aiMemory: !state.aiMemory })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      setLanguage: (language) => set({ language }),
      clearAiMemory: () => set({ aiMemory: false }),
    }),
    {
      name: 'settings-storage',
    }
  )
);