import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post('/auth/oauth2', { token });

export const self = () => api.get('/auth/self');

// Submission Service

export const submissionActivity = () => api.get('submission/activity');
