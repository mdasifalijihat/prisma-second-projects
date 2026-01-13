import { Request, Response } from "express";
import { commentServices } from "./comment.services";
import { success } from "better-auth/*";

// == Controller to create a comment ==
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

// == Controller to get comment by id ==
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not fetch comment",
    });
  }
};

// == Controller to get comment by author id ==
const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentServices.getCommentByAuthorId(
      authorId as string
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not fetch comments for the author",
    });
  }
};

// == deleted comment controller ==
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    await commentServices.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// == controller to update a comment ==
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;  
    const { commentId } = req.params;
    const { content } = req.body;
    const result = await commentServices.updateComment(
      commentId as string,
      user?.id as string,
      content
    );
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({  
      success: false,
      message: error.message,
    });
  }
};


export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
};
