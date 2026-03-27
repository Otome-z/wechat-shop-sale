import cors from "cors";
import express from "express";
import authRouter from "./routes/auth-routes";
import cartRouter from "./routes/cart-routes";
import productRouter from "./routes/product-routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ code: 0, message: "ok", data: { status: "up" } });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/cart", cartRouter);
  app.use(errorHandler);

  return app;
}
