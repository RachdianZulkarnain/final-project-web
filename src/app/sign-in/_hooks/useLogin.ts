import { useMutation } from "@tanstack/react-query";
import type { SignInResponse } from "next-auth/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, LoginPayload } from "../_api/login";

export const useLogin = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),

    onSuccess: async (data) => {
      try {
        const result = (await signIn("credentials", {
          ...data,
          id: data.id?.toString(),
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          redirect: false,
        })) as SignInResponse | undefined;

        if (result?.ok) {
          toast.success("Login successful");
          await update();

          const routes: Record<string, string> = {
            TENANT: "/dashboard",
            USER: "/",
          };

          setTimeout(() => {
            router.push(routes[data.role] || "/");
          }, 1000);
        } else {
          toast.error("Authentication failed");
        }
      } catch (error) {
        toast.error("Authentication failed");
      }
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};
