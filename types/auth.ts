export interface AuthData {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user: {
    userId?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
  };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}

export interface AuthStaff {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface AuthStaffResponse {
  message: string;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}

export interface adminSigninResponse {
  message: string;
}
export interface signinData {
  email: string;
}

export interface verifyCode {
  email: string;
  code: string;
}