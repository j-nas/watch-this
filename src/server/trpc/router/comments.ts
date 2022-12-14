import {
  router,
  publicProcedure,
  protectedProcedure,
  authedProcedure,
  canEdit,
  canRead,
} from "../trpc";
import { z } from "zod";
import axios from "axios";
import { TRPCError } from "@trpc/server";

export const commentsRouter = router({
  getMovieListComments: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.listComment.findMany({
        where: {
          movieListId: input.listId,
        },
        select: {
          id: true,
          author: true,
          body: true,
          createdAt: true,
          lastEdited: true,
          Votes: true,

        }
      });
    }),
  createNewComment: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        body: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.listComment.create({
        data: {
          body: input.body,
          movieListId: input.listId,
          userId: ctx.session.user.id,
        },
      });
    }),
  editComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        body: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.listComment.update({
        where: {
          id: input.commentId,
        },
        data: {
          body: input.body,
          lastEdited: new Date(),
        },
      });
    }
    ),
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.listComment.delete({
        where: {
          id: input.commentId,
        },
      });
    }
    ),


})