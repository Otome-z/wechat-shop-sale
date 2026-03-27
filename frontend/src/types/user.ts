export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  avatar: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
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
