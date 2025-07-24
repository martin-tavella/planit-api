import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async register(user: RegisterDto) {
    const existingUser: User | null = await this.usersService.findByEmail(
      user.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password hashing failed');
    }

    const newUser: User = await this.usersService.create({
      email: user.email,
      name: user.name,
      password: hashedPassword,
    });

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(credentials: LoginDto) {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(googleUser: {
    email: string;
    name: string;
    picture: string;
  }) {
    let user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        password: '', // Password is not used for Google login
      });
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
