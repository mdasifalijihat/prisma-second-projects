import { Request, Response } from "express";
import { PostServices } from "./post.services";

const getAllPosts = async (req: Request, res: Response) => {

  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const posts = await PostServices.getAllPosts({
      search: searchString,
    });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      error: "Failed to retrieve posts",
      details: error,
    });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const post = await PostServices.createPost(req.body, user.id as string);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create post",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};
