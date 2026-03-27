import { Router } from "express";
import { deleteCartItem, getCartSummary, patchCartItem, postCartItem } from "../controllers/cart-controller";
import { requireAuth, requireRole } from "../middleware/auth";

const cartRouter = Router();

cartRouter.use(requireAuth, requireRole("customer"));
cartRouter.get("/", getCartSummary);
cartRouter.post("/items", postCartItem);
cartRouter.patch("/items/:id", patchCartItem);
cartRouter.delete("/items/:id", deleteCartItem);

export default cartRouter;
