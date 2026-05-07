import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc-v2';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: '/src/trpc/@generated'
    })
  ],
  providers: [TrpcService, TrpcRouter]
})
export class TrpcModule {}
