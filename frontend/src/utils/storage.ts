import type { AuthUser, UserRole } from "../types/user";

const TOKEN_KEY = "shop_token";
const ROLE_KEY = "shop_role";
const USER_KEY = "shop_user";

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) as string;
}

export function setToken(token: string) {
  uni.setStorageSync(TOKEN_KEY, token);
}

export function getRole() {
  return uni.getStorageSync(ROLE_KEY) as UserRole | "";
}

export function setRole(role: UserRole) {
  uni.setStorageSync(ROLE_KEY, role);
}

export function getUser() {
  const rawValue = uni.getStorageSync(USER_KEY) as string;

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch (error) {
    return null;
  }
}

export function setUser(user: AuthUser) {
  uni.setStorageSync(USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage() {
  uni.removeStorageSync(TOKEN_KEY);
  uni.removeStorageSync(ROLE_KEY);
  uni.removeStorageSync(USER_KEY);
}
