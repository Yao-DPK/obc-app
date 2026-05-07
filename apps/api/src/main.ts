import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { TrpcRouter } from './trpc/trpc.router';
import { createContext } from './trpc/context';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });
 
  app.enableCors();
  app.setGlobalPrefix('api')

  await app.listen(3000, '0.0.0.0');
}

bootstrap();