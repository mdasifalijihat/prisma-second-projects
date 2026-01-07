import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// === GET ALL POSTS ===
router.get("/", auth(), PostController.getAllPosts);

// ===== POST ROUTES =====
router.post("/", auth(UserRole.USER), PostController.createPost);





export const PostRouter: Router = router;
