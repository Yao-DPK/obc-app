// apps/api/src/modules/inscription/inscription.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { PreRegistrationSchema } from './dto/player-registration.dto';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';

@Injectable()
export class InscriptionService {
  constructor(private userRepository: UserRepository) {}

  async preRegister(data: z.infer<typeof PreRegistrationSchema>) {
    // Vérifier si l'email du joueur existe déjà
    const existingJoueur = await this.userRepository.findByEmail(data.email);
    if (existingJoueur) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer le joueur
    const joueur = await this.userRepository.create({
      email: data.email,
      passwordHash: hashedPassword,
      role: 'player',
      registrationStatus: 'pre_inscrit',
      registrationStep: 'formulaire',
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      school: data.school,
      class: data.class,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
    });

    // Si le joueur n'est pas autonome, créer les comptes garants
    let guardiansCreated: any = [];
    if (!data.selfManaged && data.guardians) {
      for (const g of data.guardians) {
        // Vérifier si l'email du garant existe déjà (on pourrait autoriser un garant déjà existant ?)
        let guardian = await this.userRepository.findByEmail(g.email);
        if (!guardian) {
          const tempPassword = Math.random().toString(36).slice(-8);
          const hashedTemp = await bcrypt.hash(tempPassword, 10);
          guardian = await this.userRepository.create({
            email: g.email,
            passwordHash: hashedTemp,
            role: 'parent',
            registrationStatus: 'parent_invité',
            registrationStep: 'formulaire',
            firstName: g.firstName,
            lastName: g.lastName,
            phone: g.phone,
          });
          // Note : on ne notifie pas le garant pour l'instant, ce sera après validation admin
        }
        // Créer la relation guardian_relationships (à implémenter séparément)
        // Ici nous appellerons un service dédié plus tard.
        guardiansCreated.push(guardian);
      }
    }

    return { joueur, guardiansCreated };
  }
}