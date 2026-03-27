export interface ProductItem {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  status: "ON_SALE" | "OFF_SHELF";
  merchantId: number;
  merchantName: string;
  createdAt: string;
}

export interface CreateProductPayload {
  name: string;
  imageUrl?: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductPayload {
  name: string;
  imageUrl?: string;
  description: string;
  price: number;
}

export interface UpdateProductStockPayload {
  stock: number;
}

export interface UpdateProductStatusPayload {
  status: "ON_SALE" | "OFF_SHELF";
}

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  subtotal: number;
  product: CartProduct;
}

export interface CartSummary {
  list: CartItem[];
  total: number;
}
