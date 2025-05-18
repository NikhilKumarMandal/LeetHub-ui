import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post("/auth/oauth2", { token });

export const self = () => api.get("/auth/self");

// Submission Service
export const submissionActivity = () => api.get("/submission/activity");

// Problem Service
export const allProblems = (
  queryString: string,
  q: string,
  difficulty: string,
  status: string
) =>
  api.get(
    `/problem/get-problem?${queryString}&q=${q}&difficulty=${difficulty}&status:${status}`
  );
