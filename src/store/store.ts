import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  name: string;
  id: string;
  role: string;
  email: string;
  avatar: string;
}

// API response wrapping User
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
