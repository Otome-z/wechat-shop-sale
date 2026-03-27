const TOKEN_KEY = "shop_token";

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) as string;
}

export function setToken(token: string) {
  uni.setStorageSync(TOKEN_KEY, token);
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY);
}
