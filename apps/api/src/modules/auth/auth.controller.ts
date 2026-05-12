import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log("Received register request");
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    console.log("Received login request");
    return this.authService.login(dto);
  }
}