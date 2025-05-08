import { create } from "zustand";
import { devtools } from "zustand/middleware";


export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
})));
