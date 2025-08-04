import express from "express";
import {
  registerController,
  loginController,
  getMe,
} from "../controllers/auth.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", protectedRoute, getMe);

export default router;
