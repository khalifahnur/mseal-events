import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { AuthData, AuthResponse, AuthStaff, AuthStaffResponse, ErrorResponse } from "../../../types/auth";
import { toast } from "sonner";
import { loginAdmin, signUpAdmin, signUpStaff } from "@/lib/api";

export function useLogin(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
>  {
  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: loginAdmin,
    onSuccess: (data: AuthResponse) => {
      console.log("Login successful:", data);
    },
    onError: (error: ErrorResponse) => {
      console.error(
        `Login error (${error.statusCode || "Unknown"}): ${error.message}`
      );
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      if (error.details) {
        console.error("Additional error details:", error.details);
      }
    },
  });
}

export function useSignUp(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
> {
  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: signUpAdmin,
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "Sign up failed. Please try again.");
      console.error("Sign-up error:", error.message);
    },
  });
}

export const fetchLogout = async (): Promise<void> => {
  const response = await apiClient.post("/auth-user/logout");

  if (!response || response.status !== 200) {
    throw new Error("Logout failed");
  }
};

export function useStaffSignUp(): UseMutationResult<
  AuthStaffResponse,
  ErrorResponse,
  AuthStaff
> {
  const queryClient = useQueryClient();
  return useMutation<AuthStaffResponse, ErrorResponse, AuthStaff>({
    mutationFn: signUpStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['']})
      console.log("Sign-up staff successful:");
    },
    onError: (error: ErrorResponse) => {
      console.error("Sign-up staff error:", error.message);
    },
  });
}
