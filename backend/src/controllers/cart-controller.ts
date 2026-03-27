import type { Request, Response } from "express";
import { ZodError } from "zod";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cart-service";
import { sendError, sendSuccess } from "../utils/http";

function handleCartError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    sendError(res, 400, "Invalid request payload");
    return;
  }

  if (error instanceof Error) {
    if (error.message === "Product not found") {
      sendError(res, 404, error.message);
      return;
    }

    if (error.message === "Cart item not found") {
      sendError(res, 404, error.message);
      return;
    }

    if (error.message === "Insufficient stock") {
      sendError(res, 400, error.message);
      return;
    }
  }

  sendError(res, 500, "Unexpected error");
}

export async function getCartSummary(req: Request, res: Response) {
  try {
    const data = await getCart(req.auth!.userId);
    sendSuccess(res, data, "Cart loaded");
  } catch (error) {
    handleCartError(res, error);
  }
}

export async function postCartItem(req: Request, res: Response) {
  try {
    const data = await addCartItem(req.auth!.userId, req.body);
    sendSuccess(res, data, "Cart updated");
  } catch (error) {
    handleCartError(res, error);
  }
}

export async function patchCartItem(req: Request, res: Response) {
  try {
    const itemId = Number(req.params.id);
    const data = await updateCartItem(req.auth!.userId, itemId, req.body);
    sendSuccess(res, data, "Cart updated");
  } catch (error) {
    handleCartError(res, error);
  }
}

export async function deleteCartItem(req: Request, res: Response) {
  try {
    const itemId = Number(req.params.id);
    const data = await removeCartItem(req.auth!.userId, itemId);
    sendSuccess(res, data, "Cart updated");
  } catch (error) {
    handleCartError(res, error);
  }
}
