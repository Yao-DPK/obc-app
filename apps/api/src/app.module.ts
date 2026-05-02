import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './auth/auth.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditMiddleware } from './common/middleware/audit.middleware';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [TrpcModule, AuthModule, GoogleDriveModule, ConfigModule.forRoot({ isGlobal: true }), GoogleAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*'); // ou pour des routes spécifiques
  }
}