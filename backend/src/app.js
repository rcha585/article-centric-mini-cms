// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

/**
 * Configure middleware (logging, CORS support, JSON parsing support,
 * static files support, cookie parser)
 *
 * CORS is configured to allow cookies and these two origins from fetch() requests.
 * Feel free to reconfigure if required, or add your own middleware.
 */
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: [`http://localhost:${PORT}`, process.env.FRONTEND_ORIGIN],
    credentials: true
  })
);
app.use(express.json());
app.use(express.static("public"));

// Import and use our application routes.
import articlesRoutes from "./routes/articles.js";
app.use("/api/articles", articlesRoutes);

import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

import commentsRoutes from "./routes/comments.js";
app.use("/api/comments", commentsRoutes);

import likesRoutes from "./routes/likes.js";
app.use("/api/likes", likesRoutes);

import notificationsRoutes from "./routes/notifications.js";
app.use("/api/notifications", routes);

import routes from "./routes/subscriptions.js";
app.use("/api/subscriptions", notificationsRoutes);

import tagsRoutes from "./routes/tags.js";
app.use("/api/tags", tagsRoutes);

import usersRoutes from "./routes/users.js";
app.use("/api/users", usersRoutes);

// Make sure our database is up and running
import { getDatabase } from "./data/database.js";
await getDatabase();

// Start the server running.
app.listen(PORT, () => {
  console.log(`PGCIT Final Project server listening on port ${PORT}`);
});
