import type { Request, Response } from "express";
import { ZodError } from "zod";
import { getProfile, loginUser, registerUser } from "../services/auth-service";
import { sendError, sendSuccess } from "../utils/http";

function handleServiceError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    sendError(res, 400, "Invalid request payload");
    return;
  }

  if (error instanceof Error) {
    if (error.message === "Username already exists") {
      sendError(res, 409, error.message);
      return;
    }

    if (error.message === "Invalid username or password") {
      sendError(res, 401, error.message);
      return;
    }

    if (error.message === "User not found") {
      sendError(res, 404, error.message);
      return;
    }
  }

  sendError(res, 500, "Unexpected error");
}

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    sendSuccess(res, result, "Register success");
  } catch (error) {
    handleServiceError(res, error);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, result, "Login success");
  } catch (error) {
    handleServiceError(res, error);
  }
}

export async function profile(req: Request, res: Response) {
  try {
    const result = await getProfile(req.auth!.userId);
    sendSuccess(res, result, "Profile loaded");
  } catch (error) {
    handleServiceError(res, error);
  }
}
