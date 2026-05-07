import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { documentRouter } from './routers/document.router';


@Injectable()
export class TrpcRouter {

  appRouter;

  constructor(private readonly trpc: TrpcService) {
    this.appRouter = this.trpc.router({
      document: documentRouter(this.trpc),
      // user: userRouter(this.trpc),
      // guardian: guardianRouter(this.trpc),
      // payment: paymentDeclarationRouter(this.trpc),
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];