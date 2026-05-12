import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '../../database/config/db.config';
import { users, eq } from '../../database/config/db.config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
    const user = await db.select().from(users).where(eq(users.email, dto.email));
    if (!user.length) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user[0].passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user[0].id, role: user[0].role });
    return { user: { id: user[0].id, email: user[0].email, role: user[0].role }, token };
  }
}