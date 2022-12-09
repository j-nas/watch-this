import { router, publicProcedure, protectedProcedure, authedProcedure } from "../trpc"
import { z } from 'zod'
import axios from 'axios'
import { TRPCError } from "@trpc/server"

export const movieListRouter = router({
  getPublicMovieLists: publicProcedure.query(({ ctx }) => {
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


  createNewMovieList: protectedProcedure.input(
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

  addMovieToList: protectedProcedure.input(
    z.object({
      listId: z.string(),
      movieId: z.string(),
    })

  )
    .mutation(async ({ ctx, input }) => {
      const { movieId, listId } = input

      const relation = await ctx.prisma.movieListEditor.findUnique({
        where: {
          movieListId_editorId: {
            movieListId: listId,
            editorId: ctx.session.user.id
          }
        }
      })
      const author = await ctx.prisma.movieList.findUnique({
        where: {
          id: movieId
        },
        select: {
          author: true,
        }

      })

      if (!relation || author?.author.id !== ctx.session.user.id) return new TRPCError({ code: "FORBIDDEN" })

      const addToList = await ctx.prisma.movie.create({
        data: {
          movieDbId: movieId,
          movieListId: listId
        }
      })
      return addToList
    }),
  removeMovieFromList: authedProcedure.input(
    z.object({
      listId: z.string(),
      movieId: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { movieId, listId } = input

    const relation = await ctx.prisma.movieListEditor.findUnique({
      where: {
        movieListId_editorId: {
          movieListId: listId,
          editorId: ctx.session.user.id
        }
      }
    })
    const author = await ctx.prisma.movieList.findUnique({
      where: {
        id: movieId
      },
      select: {
        author: true,
      }

    })

    if (!relation || author?.author.id !== ctx.session.user.id) return new TRPCError({ code: "FORBIDDEN" })

    return await ctx.prisma.movie.delete({
      where: {
        id: input.movieId
      }
    })
  })



})