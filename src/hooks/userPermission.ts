import { useAuthStore, type User } from "./../store/store";

export const usePermission = () => {
  const { user } = useAuthStore() as { user: User | null };
  const userData = user?.role;

  const allowedRoles = ["ADMIN"];

  const role = userData?.trim().toUpperCase();

  const isAllowed = role ? allowedRoles.includes(role) : false;
  return {
    user,
    isAllowed,
  };
};
