import { login, self } from "@/http/api";
import { useAuthStore } from "@/store/store";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const loginUser = async (token: string) => {
  const { data } = await login(token);
  return data;
};

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const handleLoginSuccess = (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) {
      return toast.error("Google token not found!");
    }
    AuthLogin(googleToken);
  };

  const { mutate: AuthLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch();
      setUser(selfDataPromise?.data?.data);
      navigate("/auth/homepage");
    },
  });
  return (
    <div className="flex min-h-screen flex-col bg-black md:flex-row">
      {/* Left side - Image */}
      <div className="relative hidden w-full overflow-hidden md:block md:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/30 backdrop-blur-sm"></div>
        <div className="relative h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Abstract digital art"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 text-white">
          <h2 className="mb-2 text-3xl font-bold">Welcome</h2>
          <p className="text-sm opacity-90">
            Sign in to continue your experience
          </p>
        </div>
      </div>

      {/* Right side - Sign in with Google only */}
      <div className="flex w-full items-center justify-center bg-zinc-950 px-4 py-12 md:w-1/2 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-zinc-400">Sign in to your account to continue</p>
          </div>

          <div className="space-y-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => toast.error("Google Login failed!")}
              theme="filled_black"
              size="large"
              text="continue_with"
              width="300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
