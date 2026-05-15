import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '../../database/config/db.config';
import { users, eq } from '../../database/config/db.config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existingUser = await db.select().from(users).where(eq(users.email, dto.email));
    if (existingUser.length) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await db.insert(users).values({
      email: dto.email,
      passwordHash: hashedPassword,
      role: dto.role,
    }).returning();
    const token = this.jwtService.sign({ sub: newUser[0].id, role: newUser[0].role });
    return { user: { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role }, token };
  }

  async login(dto: LoginDto) {
    console.log("Trying to login");
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email!, number: user.phone!, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    /* const token = this.jwtService.sign({ sub: user[0].id, role: user[0].role });
    return { user: { id: user[0].id, email: user[0].email, role: user[0].role }, token }; */
  }
}