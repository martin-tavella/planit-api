import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTaskDto } from './dtos/createTask.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getTasksForUser(@CurrentUser() user: { userId: number; email: string }) {
    return this.tasksService.getTasksForUser(user.userId);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(
    @CurrentUser() user: { userId: number; email: string },
    @Body() task: CreateTaskDto,
  ) {
    return this.tasksService.create(task, user.userId);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @CurrentUser() user: { userId: number; email: string },
    @Param('id') id: number,
    @Body() task: UpdateTaskDto,
  ) {
    return this.tasksService.update(task, +id, user.userId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  delete(
    @CurrentUser() user: { userId: number; email: string },
    @Param('id') id: number,
  ) {
    return this.tasksService.delete(+id, user.userId);
  }
}
