import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import { PostServices } from "./post.services";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    // search
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    // tag search
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // isFeatured filter (not implemented yet)
    //true and false are the only valid values
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    // status filter
    const status = req.query.status as PostStatus | undefined;

    // author id
    const authorId = req.query.authorId as string | undefined;


    // pagination 
    const page = Number(req.query.page ?? 1); 
    const limit = Number(req.query.limit ?? 10)


    // fetch posts
    const posts = await PostServices.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page, limit, 
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
