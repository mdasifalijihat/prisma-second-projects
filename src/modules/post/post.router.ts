import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
const router = express.Router();

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware works");
    // next();
  };
};

router.post("/", auth(), PostController.createPost);-+
router.get("/", auth(), PostController.getAllPosts);

export const PostRouter = router;
