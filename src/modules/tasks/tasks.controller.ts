import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { CreateTaskDto } from './dtos/createTask.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(
    @CurrentUser() user: { userId: number; email: string },
    @Body() task: CreateTaskDto,
  ) {
    return this.tasksService.create(task, user.userId);
  }

  @Get('user/:userId')
  getTasksForUser(@Param('userId') userId: number) {
    return this.tasksService.getTasksForUser(+userId);
  }
}
