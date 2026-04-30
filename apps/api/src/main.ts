import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }) // ← Fastify adapter
  );
  
  // Optionnel : préfixe global, CORS, etc.
  app.enableCors();
  app.setGlobalPrefix('api');
  
  await app.listen(3000, '0.0.0.0');
}
bootstrap();