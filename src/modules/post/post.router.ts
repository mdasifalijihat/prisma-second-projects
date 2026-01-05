import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// ===== POST ROUTES =====
router.post("/", auth(UserRole.USER), PostController.createPost);

// === GET ALL POSTS ===
router.get("/", auth(), PostController.getAllPosts);

export const PostRouter: Router = router;
