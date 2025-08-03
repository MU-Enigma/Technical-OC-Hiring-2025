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
import { validate } from "../lib/validator";
import { createEventSchema, updateEventSchema } from "../validators/event";

const router = express.Router();

router.get("/", getPublicEvents);
router.get("/me", protectedRoute, getMyEvents);
router.get("/:id", protectedRoute, getEventById);
router.post("/", protectedRoute, validate(createEventSchema), createEvent);
router.put("/:id", protectedRoute, validate(updateEventSchema), updateEvent);
router.delete("/:id", protectedRoute, deleteEvent);

export default router;
