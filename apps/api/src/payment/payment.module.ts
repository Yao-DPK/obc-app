import { Module } from '@nestjs/common';
import { PaymentRouter } from './payment.router';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentRouter, PaymentService],
  exports: [PaymentRouter],
})
export class PaymentModule {}