import express from "express";
import { PostRouter } from "./modules/post/post.router";

const app = express();

app.use(express.json());

app.use("/posts", PostRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
