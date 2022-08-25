import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";
import * as trpc from "@trpc/server";
import { createRouter } from "../createRouter";

export const postRouter = createRouter()
  .mutation("create-post", {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const createdTags = await ctx.prisma.tag.createMany({
        data: input.tags.map((tag) => ({
          name: tag,
        })),
      });

      console.log(createdTags.count, input.tags);

      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          body: input.body,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
          PostTag: {
            createMany: {
              data: input.tags.map((tag) => ({
                tagName: tag,
              })),
            },
          },
        },
      });

      return post;
    },
  })
  .query("posts", {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany({
        include: { PostTag: true },
      });
    },
  })
  .query("single-post", {
    input: getSinglePostSchema,
    async resolve({ input, ctx }) {
      const data = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: { PostTag: true },
      });
      return data;
    },
  });
