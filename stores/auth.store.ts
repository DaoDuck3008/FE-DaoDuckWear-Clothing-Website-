import { create } from "zustand";
import { User } from "@/types/user.type";

interface AuthState {
  access_token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: null,
  user: null,
  hydrated: false,

  setAuth: (token: string, user: User) =>
    set({
      access_token: token,
      user,
    }),

  clearAuth: () =>
    set({
      access_token: null,
      user: null,
    }),

  setHydrated: () => set({ hydrated: true }),
}));
