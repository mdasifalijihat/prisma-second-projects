import { Request, Response } from "express";
import { PostServices } from "./post.services";

const createPost = async (req: Request, res: Response) => {
  try {
    const post = await PostServices.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create post",
      details: error,
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostServices.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      error: "Failed to retrieve posts",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};
