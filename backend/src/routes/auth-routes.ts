import { Router } from "express";
import { login, profile, register } from "../controllers/auth-controller";
import { requireAuth } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", requireAuth, profile);

export default authRouter;
