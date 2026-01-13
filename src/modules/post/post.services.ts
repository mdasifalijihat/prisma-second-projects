import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import {
  CommentStats,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
  page,
  limit,
  skip,
  sortOrder,
  sortBy,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
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

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: andConditions.length ? { AND: andConditions } : {},
    orderBy: {
      createAt: sortOrder as "asc" | "desc",
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: { ...andConditions },
    },
  });
  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// service to get post by id and increment view count
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStats.APPROVED,
          },
          include: {
            replies: {
              where: {
                status: CommentStats.APPROVED,
              },
              orderBy: { updatedAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStats.APPROVED,
                  },
                  orderBy: { updatedAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

export const PostServices = {
  createPost,
  getAllPosts,
  getPostById,
};
