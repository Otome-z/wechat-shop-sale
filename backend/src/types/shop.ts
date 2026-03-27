export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
