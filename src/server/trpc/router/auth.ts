import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { hash } from 'argon2'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input

      const exists = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (exists) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hash(input.password)


      const result = await ctx.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return {
        status: 201,
        message: "User created",
        result: result.email
      }

    }),
});
