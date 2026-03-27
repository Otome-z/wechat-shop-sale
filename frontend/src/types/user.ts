export type UserRole = "merchant" | "customer";

export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  avatar: string;
  currentRole: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  username: string;
  password: string;
  nickname: string;
  phone: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
