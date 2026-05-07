import { z } from 'zod';
import { TrpcService } from '../trpc.service';
import { db, documents, eq } from '@obc-app/database';

export function documentRouter(trpc: TrpcService) {
  return trpc.router({
    create: trpc.procedure
      .input(z.object({
        userId: z.number(),
        type: z.string(),
        fileId: z.string(),
        publicUrl: z.string().url(),
        isObligatory: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const [doc] = await db.insert(documents).values(input).returning();
        return doc;
      }),

    greet: trpc.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid Input: ${typeof val}`)
    })
    .query(({ input }) => ({greeting: `Salut, ${input}!`})),

    findByUser: trpc.procedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.select().from(documents).where(eq(documents.userId, input.userId));
      }),
  });
}