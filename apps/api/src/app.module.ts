import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditMiddleware } from './common/middleware/audit.middleware';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { DocumentModule } from './document/document.module';
import { TRPCModule } from 'nestjs-trpc-v2';
import { UserModule } from './user/user.module';
import { GuardianModule } from './guardian/guardian.module';
import { PaymentModule } from './payment/payment.module';


@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }), AuthModule, GoogleDriveModule, ConfigModule.forRoot({ isGlobal: true }), GoogleAuthModule, DocumentModule, UserModule, GuardianModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*'); // ou pour des routes spécifiques
  }
}