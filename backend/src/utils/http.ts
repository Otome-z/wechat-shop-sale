import type { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, message = "ok") {
  res.json({
    code: 0,
    message,
    data
  });
}

export function sendError(res: Response, status: number, message: string) {
  res.status(status).json({
    code: status,
    message,
    data: null
  });
}
