import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: {
    email: string;
    name: string;
    password: string;
    picture?: string;
  }): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePicture(id: number, picture: string): Promise<any> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { picture },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
