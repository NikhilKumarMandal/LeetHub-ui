import { useAuthStore } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";

function NonAuth() {
  const { user } = useAuthStore();
  if (user !== null) {
    const returnTo =
    new URLSearchParams(window.location.search).get("returnTo") || "/auth/home";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}

export default NonAuth;
