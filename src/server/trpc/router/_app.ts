import { router } from "../trpc";
import { authRouter } from "./auth";
import { movieListRouter } from "./movieList";
import { commentsRouter } from "./comments";

export const appRouter = router({
  auth: authRouter,
  movieList: movieListRouter,
  comments: commentsRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
