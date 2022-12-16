import {
  router,
  publicProcedure,
} from "../trpc"
import { z } from 'zod'
import axios from 'axios'

const movieList = z.object({
  page: z.number(),
  results: z.array(z.object({
    id: z.number(),
    title: z.string(),
    release_date: z.string(),
    poster_path: z.string().nullish(),
    vote_average: z.number(),
    overview: z.string().nullish(),
  })),
  total_pages: z.number(),
  total_results: z.number(),
})

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
    .output(movieList)
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
      page: z.number().min(1).nullish(),
      query: z.string().nullish(),
    }))
    .output(movieList)
    .mutation(async ({ input }) => {
      const { query } = input
      const { page } = input
      const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`)
      return data
    }
    ),

})

