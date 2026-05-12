import { Module } from '@nestjs/common';
import { GuardianRouter } from './guardian.router';
import { GuardianService } from './guardian.service';

@Module({
  providers: [GuardianRouter, GuardianService],
  exports: [GuardianRouter],
})
export class GuardianModule {}