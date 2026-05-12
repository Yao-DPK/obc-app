import { Module } from '@nestjs/common';
import { InscriptionRouter } from './inscription.router';
import { InscriptionService } from './inscription.service';
import { UserRepository } from '../user/user.repository';

@Module({
  providers: [InscriptionRouter, InscriptionService, UserRepository],
  exports: [InscriptionRouter],
})
export class InscriptionModule {}