import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";

function Dhashboard() {
  const { user } = useAuthStore();

  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Dhashboard;
