import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createProduct,
  getProductDetail,
  listProducts,
} from "../services/product-service";
import { sendError, sendSuccess } from "../utils/http";

function handleProductError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    sendError(res, 400, "Invalid request payload");
    return;
  }

  if (error instanceof Error && error.message === "Product not found") {
    sendError(res, 404, error.message);
    return;
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
    const data = await getProductDetail(productId);
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
