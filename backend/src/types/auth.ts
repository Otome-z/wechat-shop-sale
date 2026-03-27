export interface AuthTokenPayload {
  userId: number;
}

export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  avatar: string;
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
}
