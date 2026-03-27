import http from "./http";
import type { ApiResponse } from "../types/user";
import type {
  CreateProductPayload,
  ProductItem,
  UpdateProductPayload,
  UpdateProductStatusPayload,
  UpdateProductStockPayload,
} from "../types/shop";

export function fetchProducts() {
  return http.get<unknown, ApiResponse<ProductItem[]>>("/products");
}

export function fetchProductDetail(id: number) {
  return http.get<unknown, ApiResponse<ProductItem>>(`/products/${id}`);
}

export function createProduct(payload: CreateProductPayload) {
  return http.post<unknown, ApiResponse<ProductItem>>("/products", payload);
}

export function updateProduct(id: number, payload: UpdateProductPayload) {
  return http.patch<unknown, ApiResponse<ProductItem>>(`/products/${id}`, payload);
}

export function updateProductStock(id: number, payload: UpdateProductStockPayload) {
  return http.patch<unknown, ApiResponse<ProductItem>>(`/products/${id}/stock`, payload);
}

export function updateProductStatus(id: number, payload: UpdateProductStatusPayload) {
  return http.patch<unknown, ApiResponse<ProductItem>>(`/products/${id}/status`, payload);
}
