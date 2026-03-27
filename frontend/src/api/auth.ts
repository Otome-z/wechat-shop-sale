import http from "./http";
import type { ApiResponse, AuthResult, AuthUser, LoginPayload, RegisterPayload } from "../types/user";

export function login(payload: LoginPayload) {
  return http.post<unknown, ApiResponse<AuthResult>>("/auth/login", payload);
}

export function register(payload: RegisterPayload) {
  return http.post<unknown, ApiResponse<AuthResult>>("/auth/register", payload);
}

export function fetchProfile() {
  return http.get<unknown, ApiResponse<AuthUser>>("/auth/profile");
}
