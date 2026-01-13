import express from "express";
import cors from "cors";
import { PostRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { commentRouter } from "./modules/comment/commnet.router";

const app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.use("/posts", PostRouter);

app.use("/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
