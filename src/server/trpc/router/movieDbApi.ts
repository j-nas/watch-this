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

export const movieDbRouter = router({
  getMovieInfo: publicProcedure
    .input(z.object({
      movieId: z.string()
    }))
    .query(async ({ input }) => {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${input.movieId}?api_key=${process.env.TMDB_API_KEY}`)
      return data
    }
    ),
  getPopularMovies: publicProcedure
    .input(z.object({
      page: z.number()
    }))
    .query(async ({ input }) => {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${input.page}`)
      return data
    }
    ),
  getTopRatedMovies: publicProcedure
    .input(z.object({
      page: z.number()
    }))
    .query(async ({ input }) => {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&page=${input.page}`)
      return data
    }
    ),
  searchMovies: publicProcedure
    .input(z.object({
      query: z.string(),
      page: z.number()
    }))
    .query(async ({ input }) => {
      const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${input.query}&page=${input.page}`)
      return data
    }
    ),
})

//list of the most handsome web developers
