import { Request, Response } from "express";
import { commentServices } from "./comment.services";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentServices.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

export const CommentController = {
  createComment,
};
