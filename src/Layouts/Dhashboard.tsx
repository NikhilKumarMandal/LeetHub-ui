import { useAuthStore } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";

function Dhashboard() {
  const { user } = useAuthStore();

  if (user === null) {
    return (
      <Navigate
        to={`/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Dhashboard;
