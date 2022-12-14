import {
  router,
  publicProcedure,
  protectedProcedure,
  authedProcedure,
  canEdit,
  canRead
} from "../trpc"
import { z } from 'zod'
import axios from 'axios'
import { TRPCError } from "@trpc/server"

export const movieListRouter = router({
  getPublicMovieLists: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.movieList.findMany({
        where: {
          public: true
        },
        select: {
          title: true,
          author: true,

        }
      })
    }),
  getPublicAndReadableMovieLists: protectedProcedure
    .use(canRead)
    .query(({ ctx }) => {
      return ctx.prisma.movieList.findMany({
        where: {
          OR: [
            { public: true },
            { id: { in: ctx.session.movieListIds } }
          ]
        }
      })
    }),


  createNewMovieList: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        public: z.boolean(),
      })
    ).mutation(({ input, ctx }) => {
      return ctx.prisma.movieList.create({
        data: {
          public: input.public,
          userId: ctx.session.user.id,
          title: input.title
        }
      })
    }),

  addMovieToList: protectedProcedure

    .input(z.object({
      listId: z.string(),
      movieId: z.string(),
    })
    )
    .use(canEdit)
    .mutation(async ({ ctx, input }) => {
      const { movieId, listId } = input
      if (!ctx.session.movieListIds.includes(listId)) {
        return new TRPCError({ code: "FORBIDDEN" })
      }
      return await ctx.prisma.movieList.update({
        data: {
          movies: {
            connect: {
              id: movieId
            }
          }
        },
        where: {
          id: listId
        }
      })
    }),


  removeMovieFromList: authedProcedure
    .input(z.object({
      listId: z.string(),
      movieId: z.string(),
    })
    )
    .use(canEdit)
    .mutation(async ({ ctx, input }) => {
      const { movieId, listId } = input
      if (!ctx.session.movieListIds.includes(listId)) {
        return new TRPCError({ code: "FORBIDDEN" })
      }


      return await ctx.prisma.movie.delete({
        where: {
          id: movieId
        }
      })
    }),




})