import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: {
    email: string;
    name: string;
    password: string;
    picture?: string
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
}
