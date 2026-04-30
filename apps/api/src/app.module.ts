import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './auth/auth.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditMiddleware } from './common/middleware/audit.middleware';

@Module({
  imports: [TrpcModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*'); // ou pour des routes spécifiques
  }
}