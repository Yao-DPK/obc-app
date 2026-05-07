import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { Context } from './context';

@Injectable()
export class TrpcService {
  private trpc = initTRPC.context<Context>().create();
  public router = this.trpc.router;
  public procedure = this.trpc.procedure;
}