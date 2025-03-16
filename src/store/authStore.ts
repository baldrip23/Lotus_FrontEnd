import { create } from 'zustand';

interface AuthState {
  // Commented out authentication state
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  signOut: () => {
    // No-op for now
  },
}));