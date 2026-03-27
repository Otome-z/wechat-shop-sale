export type UserRole = "merchant" | "customer";

export interface AuthTokenPayload {
  userId: number;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  avatar: string;
  currentRole: UserRole;
}

export interface RegisterInput {
  username: string;
  password: string;
  nickname: string;
  phone: string;
}

export interface LoginInput {
  username: string;
  password: string;
  role: UserRole;
}
