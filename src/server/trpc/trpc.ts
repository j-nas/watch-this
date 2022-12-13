import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !isAuthed || !ctx.session.user || ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  })
})


/**
 * Protected procedure
**/
export const protectedProcedure = t.procedure.use(isAuthed);
export const authedProcedure = t.procedure.use(isAdmin);

/**
 * Middleware to check if user has edit permissions for a movie list
 */


const canEdit = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const movieLists = await ctx.prisma.movieListEditor.findMany({
    where: {
      editorId: ctx.session.user.id
    },
    select: {
      movieListId: true
    }
  })
  const movieListIds = movieLists.map(movieList => movieList.movieListId)
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user, movieListIds: movieListIds }
    }
  })
})
export { canEdit }

/**
 * Middleware to check if user has read permissions for a movie list
*/

const canRead = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const movieLists = await ctx.prisma.moveListReader.findMany({
    where: {
      readerId: ctx.session.user.id
    },
    select: {
      movieListId: true
    }
  })
  const movieListIds = movieLists.map(movieList => movieList.movieListId)
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user, movieListIds: movieListIds }
    }
  })
})
export { canRead }