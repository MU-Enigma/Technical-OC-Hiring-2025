import { type Request, type Response } from "express";
import prisma from "../lib/prisma";
// "/"
export const getPublicBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { posted: true },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ blogs });
  } catch (err) {
    console.error("Failed to fetch public blogs:", err);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching blogs." });
  }
};

// /:id
export const getBlogsById = async (req: Request, res: Response) => {
  try {
    const blogId = Number(req.params.id);
    const userId = req.userId;

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.posted && blog.authorId !== userId)
      return res.status(403).json({ message: "Unauhorized" });

    res.json(blog);
  } catch (error) {
    console.error("Failed to fetch the blog with that Id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// /me

export const getMyBlogs = async (req: Request, res: Response) => {
  try {
    const myBlogs = await prisma.blog.findMany({
      where: { authorId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(myBlogs);
  } catch (error) {
    console.error("failed to fetch my blogs", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// "/"
export const createBlog = async (req: Request, res: Response) => {
  console.log("hit create blog");
  const { title, content, posted } = req.body;
  if (!title || !content)
    return res
      .status(500)
      .json({ message: "either content or title is missing" });
  try {
    const createdBlog = await prisma.blog.create({
      data: {
        title,
        content,
        posted: posted ?? false,
        authorId: Number(req.userId),
        updatedAt: new Date(),
      },
    });

    res.status(201).json(createdBlog);
  } catch (error) {
    console.error("Failed to create blog", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// "/:id"

export const updateBlog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  const { title, content, posted } = req.body;

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog)
      return res.status(404).json({ message: "Blog not found" });
    if (existingBlog.authorId !== req.userId) {
      return res.status(403).json({ message: "Unauhorized" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        content,
        posted,
        updatedAt: new Date(),
      },
    });
    res.json(updatedBlog);
  } catch (error) {
    console.error("Failed updating the blog", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  try {
    const existing = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existing) return res.status(404).json({ message: "Blog not found" });

    if (existing.authorId !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await prisma.blog.delete({ where: { id: blogId } });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in deleting blog", error);
    res.status(500).json({ message: "Could not delete the blog " });
  }
};
