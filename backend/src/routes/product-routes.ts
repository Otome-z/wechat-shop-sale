import { Router } from "express";
import { getProduct, getProducts, postProduct } from "../controllers/product-controller";
import { requireAuth, requireRole } from "../middleware/auth";

const productRouter = Router();

productRouter.get("/", requireAuth, getProducts);
productRouter.get("/:id", requireAuth, getProduct);
productRouter.post("/", requireAuth, requireRole("merchant"), postProduct);

export default productRouter;
