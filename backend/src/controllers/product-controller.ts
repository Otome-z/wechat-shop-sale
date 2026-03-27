import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createProduct,
  getProductDetail,
  listProducts,
  updateProduct,
  updateProductStatus,
  updateProductStock,
} from "../services/product-service";
import { sendError, sendSuccess } from "../utils/http";

function handleProductError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    sendError(res, 400, "Invalid request payload");
    return;
  }

  if (error instanceof Error) {
    if (error.message === "Product not found") {
      sendError(res, 404, error.message);
      return;
    }

    if (error.message === "Only off-shelf products can be edited") {
      sendError(res, 409, error.message);
      return;
    }
  }

  sendError(res, 500, "Unexpected error");
}

export async function getProducts(req: Request, res: Response) {
  try {
    const data = await listProducts(req.auth!.userId, req.auth!.role);
    sendSuccess(res, data, "Products loaded");
  } catch (error) {
    handleProductError(res, error);
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const data = await getProductDetail(productId, req.auth!.userId, req.auth!.role);
    sendSuccess(res, data, "Product loaded");
  } catch (error) {
    handleProductError(res, error);
  }
}

export async function postProduct(req: Request, res: Response) {
  try {
    const data = await createProduct(req.auth!.userId, req.body);
    sendSuccess(res, data, "Product created");
  } catch (error) {
    handleProductError(res, error);
  }
}

export async function patchProductStock(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const data = await updateProductStock(req.auth!.userId, productId, req.body);
    sendSuccess(res, data, "Product stock updated");
  } catch (error) {
    handleProductError(res, error);
  }
}

export async function patchProductStatus(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const data = await updateProductStatus(req.auth!.userId, productId, req.body);
    sendSuccess(res, data, "Product status updated");
  } catch (error) {
    handleProductError(res, error);
  }
}

export async function patchProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const data = await updateProduct(req.auth!.userId, productId, req.body);
    sendSuccess(res, data, "Product updated");
  } catch (error) {
    handleProductError(res, error);
  }
}
