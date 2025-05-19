import type { FilterData } from "@/Types";
import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post("/auth/oauth2", { token });

export const self = () => api.get("/auth/self");

// Submission Service
export const submissionActivity = () => api.get("/submission/activity");

// Problem Service
export const allProblems = (filters: FilterData) =>
  api.get(
    `/problem/get-problem?${filters.queryParams}&q=${filters.q}&difficulty=${filters.difficulty}&status:${filters.status}`
  );

export const getAllTopicAndCompanyName = () => api.get("/problem/all-topics");
