import { self } from "@/http/api";
import { useAuthStore } from "@/store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

function Root() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fetchCount = useRef(0);

  const { data } = useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      if (fetchCount.current < 2) {
        fetchCount.current += 1;
        return getSelf();
      } else {
        return queryClient.getQueryData(["self"]);
      }
    },
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default Root;
