import { defineStore } from "pinia";
import { fetchProfile, login, register } from "../api/auth";
import { clearAuthStorage, getRole, getToken, getUser, setRole, setToken, setUser } from "../utils/storage";
import type { AuthUser, LoginPayload, RegisterPayload, UserRole } from "../types/user";

interface AuthState {
  token: string;
  role: UserRole | "";
  user: AuthUser | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: getToken(),
    role: getRole(),
    user: getUser()
  }),
  actions: {
    setSession(token: string, user: AuthUser) {
      setToken(token);
      setRole(user.currentRole);
      setUser(user);

      this.token = token;
      this.role = user.currentRole;
      this.user = user;
    },
    async login(payload: LoginPayload) {
      const response = await login(payload);
      this.setSession(response.data.token, response.data.user);
    },
    async register(payload: RegisterPayload) {
      const response = await register(payload);
      this.setSession(response.data.token, response.data.user);
    },
    async loadProfile() {
      const response = await fetchProfile();
      this.user = response.data;
      this.role = response.data.currentRole;
      setUser(response.data);
      setRole(response.data.currentRole);
    },
    logout() {
      clearAuthStorage();
      this.token = "";
      this.role = "";
      this.user = null;
    },
    hasRole(role: UserRole) {
      return this.role === role;
    }
  }
});
