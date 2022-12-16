import {
  router,
  protectedProcedure,
} from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const votingRouter = router({
  upvoteMovieList: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentVote = await ctx.prisma.votes.findFirst({
        where: {
          movieListId: input.listId,
          userId: ctx.session.user.id,
        },
      });
      if (currentVote?.upOrDown === 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already upvoted this list",
        });
      } else if (currentVote?.upOrDown === -1) {
        await ctx.prisma.votes.update({
          where: {
            id: currentVote.id,
          },
          data: {
            upOrDown: 1,
          },
        });
      } else {
        await ctx.prisma.votes.create({
          data: {
            movieListId: input.listId,
            userId: ctx.session.user.id,
            upOrDown: 1,
          },
        });
      }
    }),
  downvoteMovieList: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentVote = await ctx.prisma.votes.findFirst({
        where: {
          movieListId: input.listId,
          userId: ctx.session.user.id,
        },
      });
      if (currentVote?.upOrDown === -1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already downvoted this list",
        });
      } else if (currentVote?.upOrDown === 1) {
        await ctx.prisma.votes.update({
          where: {
            id: currentVote.id,
          },
          data: {
            upOrDown: -1,
          },
        });
      } else {
        await ctx.prisma.votes.create({
          data: {
            movieListId: input.listId,
            userId: ctx.session.user.id,
            upOrDown: -1,
          },
        });
      }
    }),
  clearVoteMovieList: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentVote = await ctx.prisma.votes.findFirst({
        where: {
          movieListId: input.listId,
          userId: ctx.session.user.id,
        },
      });
      if (currentVote) {
        await ctx.prisma.votes.update({
          where: {
            id: currentVote.id,
          },
          data: {
            upOrDown: 0,
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not voted on this list",
        });
      }
    }),


})