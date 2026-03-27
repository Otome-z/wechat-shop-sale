import { ProductStatus } from "../../generated/prisma-role-client";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import type {
  CreateProductInput,
  UpdateProductInput,
  UpdateProductStatusInput,
  UpdateProductStockInput,
} from "../types/shop";
import type { UserRole } from "../types/auth";

const DEFAULT_PRODUCT_IMAGE_URL =
  "https://pic4.zhimg.com/80/v2-5107688cc637cf3cf5044c4a475ba7ad_720w.webp";

const createProductSchema = z.object({
  name: z.string().min(1).max(50),
  imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  description: z.string().min(1).max(500),
  price: z.number().positive().max(999999),
  stock: z.number().int().min(0).max(999999)
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(50),
  imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  description: z.string().min(1).max(500),
  price: z.number().positive().max(999999)
});

const updateProductStockSchema = z.object({
  stock: z.number().int().min(0).max(999999)
});

const updateProductStatusSchema = z.object({
  status: z.nativeEnum(ProductStatus)
});

type ProductWithMerchant = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: { toNumber(): number };
  stock: number;
  status: ProductStatus;
  merchantId: number;
  createdAt: Date;
  merchant?: { nickname: string };
};

function toProductDTO(product: ProductWithMerchant) {
  return {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stock,
    status: product.status,
    merchantId: product.merchantId,
    merchantName: product.merchant?.nickname ?? "",
    createdAt: product.createdAt.toISOString()
  };
}

async function findMerchantProduct(productId: number, merchantId: number) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      merchantId
    },
    include: {
      merchant: {
        select: {
          nickname: true
        }
      }
    }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
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

export async function getProductDetail(productId: number, userId: number, role: UserRole) {
  if (role === "merchant") {
    const product = await findMerchantProduct(productId, userId);
    return toProductDTO(product);
  }

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
      imageUrl: payload.imageUrl || DEFAULT_PRODUCT_IMAGE_URL,
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

export async function updateProductStock(
  merchantId: number,
  productId: number,
  input: UpdateProductStockInput
) {
  const payload = updateProductStockSchema.parse(input);
  await findMerchantProduct(productId, merchantId);

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: payload.stock
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

export async function updateProductStatus(
  merchantId: number,
  productId: number,
  input: UpdateProductStatusInput
) {
  const payload = updateProductStatusSchema.parse(input);
  await findMerchantProduct(productId, merchantId);

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      status: payload.status
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

export async function updateProduct(
  merchantId: number,
  productId: number,
  input: UpdateProductInput
) {
  const payload = updateProductSchema.parse(input);
  const currentProduct = await findMerchantProduct(productId, merchantId);

  if (currentProduct.status !== ProductStatus.OFF_SHELF) {
    throw new Error("Only off-shelf products can be edited");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name: payload.name,
      imageUrl: payload.imageUrl || DEFAULT_PRODUCT_IMAGE_URL,
      description: payload.description,
      price: payload.price
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
