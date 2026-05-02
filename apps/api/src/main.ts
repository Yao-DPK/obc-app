import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Enregistrement du plugin multipart avec options
  // Note: si l'erreur TS2345 persiste, vérifiez que fastify et @fastify/multipart sont à jour et compatibles.
  // Ajoutez dans le package.json racine : "pnpm": { "overrides": { "fastify": "5.8.5" } }
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