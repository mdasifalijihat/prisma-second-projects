import { prisma } from "../../lib/prisma";

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

export const commentServices = {
  createComment,
};
