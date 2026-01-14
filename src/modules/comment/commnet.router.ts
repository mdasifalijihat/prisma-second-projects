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
// == Route to delete a comment ==
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.deleteComment
);

// == Route to update a comment ==
router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.updateComment
);

// == Route to moderate a comment ==
router.patch(
  "/:commentId/moderate",
  auth(UserRole.ADMIN),
  CommentController.moderateComment
);

export const commentRouter = router;
