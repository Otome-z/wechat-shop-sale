export interface CreateProductInput {
  name: string;
  imageUrl?: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductInput {
  name: string;
  imageUrl?: string;
  description: string;
  price: number;
}

export interface UpdateProductStockInput {
  stock: number;
}

export interface UpdateProductStatusInput {
  status: "ON_SALE" | "OFF_SHELF";
}

export interface UpdateCartItemInput {
  quantity: number;
}
