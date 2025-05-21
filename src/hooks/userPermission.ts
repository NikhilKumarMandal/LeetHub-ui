import { useAuthStore, type ApiResponse, type User } from "./../store/store";

export const usePermission = () => {
  const { user } = useAuthStore() as { user: ApiResponse<User> | null };
  const userData = user?.data;

  const allowedRoles = ["ADMIN"];

  const role = userData?.role?.trim().toUpperCase();

  const isAllowed = role ? allowedRoles.includes(role) : false;
  return {
    user,
    isAllowed,
  };
};
