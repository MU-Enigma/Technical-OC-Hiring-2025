import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogsById,
  getMyBlogs,
  getPublicBlogs,
  updateBlog,
} from "../controllers/blog.controller";
import { protectedRoute } from "../middleware/protectedRoute";
import { validate } from "../lib/validator";
import { createBlogSchema, updateBlogSchema } from "../validators/blog";

const router = express.Router();

router.get("/", getPublicBlogs);
router.get("/me", protectedRoute, getMyBlogs);
router.get("/:id", getBlogsById); //protectedRoute not needed
router.post("/", protectedRoute, validate(createBlogSchema), createBlog);
router.put("/:id", protectedRoute, validate(updateBlogSchema), updateBlog);
router.delete("/:id", protectedRoute, deleteBlog);

export default router;
