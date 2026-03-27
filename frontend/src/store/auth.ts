import { defineStore } from "pinia";
import { fetchProfile, login, register } from "../api/auth";
import { clearToken, setToken } from "../utils/storage";
import type { AuthUser, LoginPayload, RegisterPayload } from "../types/user";

interface AuthState {
  token: string;
  user: AuthUser | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: "",
    user: null
  }),
  actions: {
    async login(payload: LoginPayload) {
      const response = await login(payload);

      setToken(response.data.token);
      this.token = response.data.token;
      this.user = response.data.user;
    },
    async register(payload: RegisterPayload) {
      const response = await register(payload);

      setToken(response.data.token);
      this.token = response.data.token;
      this.user = response.data.user;
    },
    async loadProfile() {
      const response = await fetchProfile();
      this.user = response.data;
    },
    logout() {
      clearToken();
      this.token = "";
      this.user = null;
    }
  }
});
