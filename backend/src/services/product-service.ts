import { ProductStatus } from "../../generated/prisma-role-client";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import type { CreateProductInput } from "../types/shop";
import type { UserRole } from "../types/auth";

const createProductSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  price: z.number().positive().max(999999),
  stock: z.number().int().min(0).max(999999)
});

function toProductDTO(product: {
  id: number;
  name: string;
  description: string;
  price: { toNumber(): number };
  stock: number;
  status: ProductStatus;
  merchantId: number;
  createdAt: Date;
  merchant?: { nickname: string };
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stock,
    status: product.status,
    merchantId: product.merchantId,
    merchantName: product.merchant?.nickname ?? "",
    createdAt: product.createdAt.toISOString()
  };
}

export async function listProducts(userId: number, role: UserRole) {
  const products = await prisma.product.findMany({
    where:
      role === "merchant"
        ? { merchantId: userId }
        : { status: ProductStatus.ON_SALE },
    include: {
      merchant: {
        select: {
          nickname: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return products.map(toProductDTO);
}

export async function getProductDetail(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      merchant: {
        select: {
          nickname: true
        }
      }
    }
  });

  if (!product || product.status !== ProductStatus.ON_SALE) {
    throw new Error("Product not found");
  }

  return toProductDTO(product);
}

export async function createProduct(merchantId: number, input: CreateProductInput) {
  const payload = createProductSchema.parse(input);

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      merchantId,
      status: ProductStatus.ON_SALE
    },
    include: {
      merchant: {
        select: {
          nickname: true
        }
      }
    }
  });

  return toProductDTO(product);
}
