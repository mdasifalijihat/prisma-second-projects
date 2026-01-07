import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];

  // search condition
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  // tags condition
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  // isFeatured condition
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }

  // status condition
  if (status) {
    andConditions.push({
      status,
    });
  }

  // authorId condition
  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  const results = await prisma.post.findMany({
    where: {
      AND: { ...andConditions },
    },
  });
  return results;
};

export const PostServices = {
  createPost,
  getAllPosts,
};
