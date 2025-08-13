import express from "express";
import {
  registerController,
  loginController,
  getMe,
} from "../controllers/auth.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";
import { validate } from "../lib/validator.ts";
import { loginSchema, registerSchema } from "../validators/auth.ts";

const router = express.Router();

router.post("/register", validate(registerSchema),registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/me", protectedRoute, getMe);

export default router;
