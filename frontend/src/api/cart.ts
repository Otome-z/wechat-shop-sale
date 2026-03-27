import http from "./http";
import type { ApiResponse } from "../types/user";
import type { CartSummary } from "../types/shop";

export function fetchCart() {
  return http.get<unknown, ApiResponse<CartSummary>>("/cart");
}

export function addToCart(payload: { productId: number; quantity: number }) {
  return http.post<unknown, ApiResponse<CartSummary>>("/cart/items", payload);
}

export function updateCartItem(id: number, payload: { quantity: number }) {
  return http.patch<unknown, ApiResponse<CartSummary>>(`/cart/items/${id}`, payload);
}

export function deleteCartItem(id: number) {
  return http.delete<unknown, ApiResponse<CartSummary>>(`/cart/items/${id}`);
}
