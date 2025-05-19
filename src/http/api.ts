import type { FilterData } from "@/Types";
import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post("/auth/oauth2", { token });

export const self = () => api.get("/auth/self");

// Submission Service
export const submissionActivity = () => api.get("/submission/activity");

// Problem Service
export const allProblems = (filters: FilterData) => {
  const params = new URLSearchParams();

  if (filters.queryParams) {
    const qp = new URLSearchParams(filters.queryParams);
    qp.forEach((value, key) => {
      if (value) params.append(key, value);
    });
  }

  if (filters.q) params.append("q", filters.q);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);
  if (filters.status) params.append("status", filters.status);
  if (filters.topic) params.append("topic", filters.topic);

  return api.get(`/problem/get-problem?${params.toString()}`);
};

export const getAllTopicAndCompanyName = () => api.get("/problem/all-topics");
