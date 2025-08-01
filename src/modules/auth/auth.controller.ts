import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { email, name, picture } = req.user as {
      email: string;
      name: string;
      picture: string;
    };
    const { access_token } = await this.authService.loginWithGoogle({
      email,
      name,
      picture,
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${access_token}`,
    );
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
