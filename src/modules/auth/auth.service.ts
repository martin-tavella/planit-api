import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user: User | null = await this.usersService.findByEmail(
      credentials.email,
    );
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = bcrypt.compareSync(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
