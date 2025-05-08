import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post('/auth/oauth2', { token });