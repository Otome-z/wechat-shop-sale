import { ProductStatus } from "../../generated/prisma-role-client";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import type { UpdateCartItemInput } from "../types/shop";

const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(99)
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(99)
});

function toCartItemDTO(item: {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: { toNumber(): number };
    stock: number;
    description: string;
  };
}) {
  const price = item.product.price.toNumber();

  return {
    id: item.id,
    quantity: item.quantity,
    subtotal: Number((price * item.quantity).toFixed(2)),
    product: {
      id: item.product.id,
      name: item.product.name,
      price,
      stock: item.product.stock,
      description: item.product.description
    }
  };
}

export async function getCart(userId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const list = items.map(toCartItemDTO);
  const total = Number(list.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

  return {
    list,
    total
  };
}

export async function addCartItem(userId: number, input: { productId: number; quantity: number }) {
  const payload = addCartItemSchema.parse(input);

  const product = await prisma.product.findUnique({
    where: { id: payload.productId }
  });

  if (!product || product.status !== ProductStatus.ON_SALE) {
    throw new Error("Product not found");
  }

  if (product.stock < payload.quantity) {
    throw new Error("Insufficient stock");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: payload.productId
      }
    }
  });

  const nextQuantity = (existingItem?.quantity ?? 0) + payload.quantity;

  if (nextQuantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId: payload.productId
      }
    },
    update: {
      quantity: nextQuantity
    },
    create: {
      userId,
      productId: payload.productId,
      quantity: payload.quantity
    }
  });

  return getCart(userId);
}

export async function updateCartItem(userId: number, itemId: number, input: UpdateCartItemInput) {
  const payload = updateCartItemSchema.parse(input);

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId
    },
    include: {
      product: true
    }
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (payload.quantity > cartItem.product.stock) {
    throw new Error("Insufficient stock");
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity: payload.quantity
    }
  });

  return getCart(userId);
}

export async function removeCartItem(userId: number, itemId: number) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId
    }
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: itemId }
  });

  return getCart(userId);
}
