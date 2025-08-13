import express from "express";
import {
  getPublicEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { protectedRoute } from "../middleware/protectedRoute";
// import { validate } from "../lib/validator";
// import { createEventSchema, updateEventSchema } from "../validators/event";
import { adminOnly } from "../middleware/adminRoute";

const router = express.Router();

router.get("/", getPublicEvents);
router.get("/me", protectedRoute,adminOnly, getMyEvents);
router.get("/:id", protectedRoute, getEventById);
router.post("/", protectedRoute, adminOnly, createEvent);
router.put("/:id", protectedRoute, adminOnly, updateEvent);
router.delete("/:id", protectedRoute, adminOnly, deleteEvent);

export default router;
