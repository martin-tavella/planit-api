import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('user/:userId')
  getTasksForUser(@Param('userId') userId: number) {
    return this.tasksService.getTasksForUser(userId);
  }
}
