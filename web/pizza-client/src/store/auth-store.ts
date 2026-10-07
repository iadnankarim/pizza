"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  pendingEmail: string | null;
  city: string;
  requestOtp: (email: string) => void;
  verifyOtp: (otp: string, name: string) => boolean;
  logout: () => void;
  setCity: (city: string) => void;
}

/** Mock auth – replace requestOtp / verifyOtp with calls to your Express API */
export const DEMO_OTP = "123456";

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingEmail: null,
      city: "Mumbai",
      requestOtp: (email) => set({ pendingEmail: email }),
      verifyOtp: (otp, name) => {
        const email = get().pendingEmail;
        if (!email || otp !== DEMO_OTP) return false;
        set({ user: { email, name }, pendingEmail: null });
        return true;
      },
      logout: () => set({ user: null }),
      setCity: (city) => set({ city }),
    }),
    { name: "pizza-auth" }
  )
);
