import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.ts";
import blogRoutes from "./routes/blog.routes.ts";
import eventRoutes from "./routes/event.routes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
