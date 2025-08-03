import { type Request, type Response } from "express";
import prisma from "../lib/prisma";

export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });
    res.json({ events });
  } catch (err) {
    console.error("Failed to fetch public events:", err);
    res.status(500).json({ message: "Interal Server error" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Failed to fetch event by ID", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.userId },
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (err) {
    console.error("Failed to fetch user events", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, desc, location, date } = req.body;

  if (!title || !desc || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        desc,
        location,
        date: new Date(date),
        userId: Number(req.userId),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Failed to create event", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  const { title, desc, location, date } = req.body;

  try {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });

    if (!existing) return res.status(404).json({ message: "Event not found" });
    if (existing.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        desc,
        location,
        date: date ? new Date(date) : undefined,
        updatedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating event", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);

  try {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });

    if (!existing) return res.status(404).json({ message: "Event not found" });
    if (existing.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.event.delete({ where: { id: eventId } });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
