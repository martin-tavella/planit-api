import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  registerUser(
    @Body() user: { email: string; name: string; password: string },
  ) {
    return this.usersService.registerUser(user);
  }
}
