import { auth } from "./../../lib/auth";
import { prisma } from "../../lib/prisma";

// == Service to create a comment ==
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  const postData = await prisma.post.findUnique({
    where: { id: payload.postId },
  });
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: payload.parentId },
    });
    if (!parentComment) {
      throw new Error("Parent comment not found");
    }
  }
  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

// ==get comment id by id service==
const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

// == specify user authorship in services ==
const getCommentByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: { authorId },
    orderBy: { updatedAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

// === deleted comment service ===
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Comment not found or unauthorized");
  }
  return await prisma.comment.delete({
    where: { id: commentId },
  });
};

// == comment update service ==
const updateComment = async (
  commentId: string,
  authorId: string,
  content: string
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Comment not found or unauthorized");
  }
  return await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

export const commentServices = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
};
