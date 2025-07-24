import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('login')
  loginUser(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
