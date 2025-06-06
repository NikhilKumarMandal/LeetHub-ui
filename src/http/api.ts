import type {
  DiscussionData,
  Execute,
  FilterData,
  PlaylistData,
  ProblemData,
} from "@/Types";
import { api } from "./client";

// Auth Service
export const login = (token: string) => api.post("/auth/oauth2", { token });

export const self = () => api.get("/auth/self");

export const update = () => api.patch("/auth/update-profile");

export const logout = () => api.post("/auth/logout");

// Vote Service
export const toggleFavorite = (problemId: string) =>
  api.post(`/auth/${problemId}/favorite`);

export const favoriteProblems = () => api.get("/auth/favorite-problems");

// Submission Service
export const submissionActivity = () => api.get("/submission/activity");

export const submissionData = (page: number) =>
  api.get(`/submission/submission-data?page=${page}`);

export const submissionHistory = (page: number) =>
  api.get(`submission/submission-history?page=${page}`);

// Problem Service
export const createProblem = (problemData: ProblemData) =>
  api.post("/problem/create-problem", problemData);

export const deleteProblem = (id: string) => api.delete(`/problem/${id}`);

export const updateProblem = (id: string, problemData: ProblemData) =>
  api.put(`/problem/update-problem/${id}`, problemData);

export const problemById = (id: string) =>
  api.get(`/problem/get-problem/${id}`);

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

export const allProblemAvaiableInTheDatabase = () =>
  api.get("/problem/get-problem");

export const getAllTopicAndCompanyName = () => api.get("/problem/all-topics");

// Playlist
export const createPlaylist = (data: PlaylistData) =>
  api.post("/playlist/", data);

export const getALLPlaylistDetails = () => api.get("/playlist/");

export const fetchAllPlaylist = () => api.get("/playlist/get-all-playlist");

export const getPlaylistById = (id: string) => api.get(`/playlist/${id}`);

export const addProblemInPlaylist = (id: string, problemId: string) =>
  api.post(`/playlist/${id}/add-problem`, { problemId });

export const getAllPlaylist = (id: string) => api.get(`/playlist/${id}`);

// Execute Code Service

export const executeCode = (executeData: Execute) =>
  api.post("/execute-code/execute", executeData);

// Vote Service

export const voteOnProblem = (id: string, type: "UPVOTE" | "DOWNVOTE") =>
  api.post(`/vote/vote-problem/${id}`, { type });

export const getAllVote = (problemId: string) =>
  api.get(`/vote/get-voted-problem/${problemId}`);

// Submission Service

export const getsubmissionDetails = (problemId: string) =>
  api.get(`/submission/get-submission/${problemId}`);

// Discussion Service

export const createDiscussion = (data: DiscussionData) =>
  api.post("/discussion/create-discussion", data);

export const getProblemDiscussion = (problemId: string) =>
  api.get(`/discussion/${problemId}`);

export const deleteProblemDiscussion = (id: string) =>
  api.delete(`/discussion/${id}`);
