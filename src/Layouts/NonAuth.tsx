import { useAuthStore } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";

function NonAuth() {
  const { user } = useAuthStore();
  if (user !== null) {
    const returnTo =
      new URLSearchParams(location.search).get("returnTo") || "/auth/hello";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}

export default NonAuth;
