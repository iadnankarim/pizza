"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  restaurant: string;
}

interface AuthState {
  admin: AdminProfile | null;
  login: (admin: AdminProfile) => void;
  logout: () => void;
  updateProfile: (patch: Partial<AdminProfile>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      login: (admin) => set({ admin }),
      logout: () => set({ admin: null }),
      updateProfile: (patch) => set((s) => (s.admin ? { admin: { ...s.admin, ...patch } } : s)),
    }),
    { name: "pizza-admin-auth" }
  )
);
