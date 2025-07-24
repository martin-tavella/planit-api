import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    const { email, name, picture } = req.user as {
      email: string;
      name: string;
      picture: string;
    };
    return this.authService.loginWithGoogle({ email, name, picture });
  }
  @Post('register')
  registerUser(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('login')
  loginUser(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
