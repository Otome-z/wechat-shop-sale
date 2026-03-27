import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendError } from "../utils/http";
import type { AuthTokenPayload } from "../types/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, 401, "Unauthorized");
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.auth = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    next();
  } catch (error) {
    sendError(res, 401, "Invalid token");
  }
}
