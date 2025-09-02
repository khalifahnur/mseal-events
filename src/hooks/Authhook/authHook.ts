import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { adminSigninResponse, AuthData, AuthResponse, AuthStaff, AuthStaffResponse, ErrorResponse, signinData, verifyCode } from "../../../types/auth";
import { toast } from "sonner";
import { adminSignin, loginAdmin, signUpAdmin, signUpStaff, verifyPsswdCode } from "@/lib/api";

export function useLogin(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
>  {
  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: loginAdmin,
    onError: (error: ErrorResponse) => {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      // if (error.details) {
      //   console.error("Additional error details:", error.details);
      // }
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
    },
  });
}

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
    },
    onError: (error: ErrorResponse) => {
      console.error("Sign-up staff error:", error.message);
    },
  });
}


export function useAdminSignin(): UseMutationResult<
  adminSigninResponse,
  ErrorResponse,
  signinData
> {
  return useMutation<adminSigninResponse, ErrorResponse, signinData>({
    mutationFn: adminSignin,
    onError: (error: ErrorResponse) => {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      if (error.details) {
        console.error("Additional error details:", error.details);
      }
    },
  });
}

export function useVerifyCode(): UseMutationResult<
  adminSigninResponse,
  ErrorResponse,
  verifyCode
> {
  return useMutation<adminSigninResponse, ErrorResponse, verifyCode>({
    mutationFn: verifyPsswdCode,
    onError: (error: ErrorResponse) => {
      console.error(
        `Verify code error (${error.statusCode || "Unknown"}): ${error.message}`
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
