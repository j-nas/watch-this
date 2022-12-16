import { router } from "../trpc";
import { authRouter } from "./auth";
import { movieListRouter } from "./movieList";
import { commentsRouter } from "./comments";
import { movieDbRouter } from "./movieDbApi";
export const appRouter = router({
  auth: authRouter,
  movieList: movieListRouter,
  comments: commentsRouter,
  movieDb: movieDbRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
