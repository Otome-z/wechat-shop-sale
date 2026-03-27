import http from "./http";
import type { ApiResponse } from "../types/user";
import type { CreateProductPayload, ProductItem } from "../types/shop";

export function fetchProducts() {
  return http.get<unknown, ApiResponse<ProductItem[]>>("/products");
}

export function fetchProductDetail(id: number) {
  return http.get<unknown, ApiResponse<ProductItem>>(`/products/${id}`);
}

export function createProduct(payload: CreateProductPayload) {
  return http.post<unknown, ApiResponse<ProductItem>>("/products", payload);
}
