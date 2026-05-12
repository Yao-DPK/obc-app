import { Router, Mutation, Input } from 'nestjs-trpc-v2';
import { InscriptionService } from './inscription.service';
import { PreRegistrationSchema } from './dto/player-registration.dto';

@Router({ alias: 'inscription' })
export class InscriptionRouter {
  constructor(private readonly inscriptionService: InscriptionService) {}

  @Mutation({ input: PreRegistrationSchema })
  async preRegister(@Input() input: any) {
    return this.inscriptionService.preRegister(input);
  }
}