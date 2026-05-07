import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  // À compléter : décoder le JWT stocké dans l'en-tête Authorization
  const getUser = () => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      // Vérifier et décoder (avec @nestjs/jwt)
      return null; // user ou null
    }
    return null;
  };
  return { req, res, user: getUser() };
}
export type Context = inferAsyncReturnType<typeof createContext>;