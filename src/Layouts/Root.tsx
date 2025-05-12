import { self } from "@/http/api";
import { useAuthStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

function Root() {
  const { setUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Root;
