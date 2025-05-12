import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClinet = new QueryClient();

const googleClientId =
  "96337949620-r14jftljj42ll04nan7cusibptbc8hqb.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClinet}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Toaster />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
