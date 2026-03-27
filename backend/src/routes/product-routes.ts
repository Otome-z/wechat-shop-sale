import { Router } from "express";
import {
  getProduct,
  getProducts,
  patchProduct,
  patchProductStatus,
  patchProductStock,
  postProduct,
} from "../controllers/product-controller";
import { requireAuth, requireRole } from "../middleware/auth";

const productRouter = Router();

productRouter.get("/", requireAuth, getProducts);
productRouter.get("/:id", requireAuth, getProduct);
productRouter.post("/", requireAuth, requireRole("merchant"), postProduct);
productRouter.patch("/:id", requireAuth, requireRole("merchant"), patchProduct);
productRouter.patch("/:id/stock", requireAuth, requireRole("merchant"), patchProductStock);
productRouter.patch("/:id/status", requireAuth, requireRole("merchant"), patchProductStatus);

export default productRouter;
