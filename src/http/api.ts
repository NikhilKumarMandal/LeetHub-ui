import { api } from "./client";

// Auth Service
export const oauth = (data: string) => api.post('/oauth', data);