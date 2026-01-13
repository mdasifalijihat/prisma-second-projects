import { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

// == Route to get comment by id ==
router.get(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.getCommentById
);

// == Route to get getCommentByAuthorId by id ==
router.get(
  "/author/:authorId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.getCommentByAuthorId
);

// == Route to create a comment ==
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment
);

export const commentRouter = router;
