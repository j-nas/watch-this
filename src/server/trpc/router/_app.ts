import { router } from "../trpc";
import { authRouter } from "./auth";
import { movieListRouter } from "./movieList";

export const appRouter = router({
  auth: authRouter,
  movieList: movieListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
