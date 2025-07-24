import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dtos/createTask.dto';
import { Task } from 'generated/prisma';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async validateTaskOwnership(
    taskId: number,
    userId: number,
  ): Promise<void> {
    const existingTask: Task | null = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }
    if (existingTask.userId !== userId) {
      throw new UnauthorizedException('Unauthorized access to update task');
    }
  }

  async getTasksForUser(userId: number) {
    return await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(task: CreateTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: {
        ...task,
        userId: userId,
      },
    });
  }

  async update(task: UpdateTaskDto, taskId: number, userId: number) {
    await this.validateTaskOwnership(taskId, userId);
    return await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...task,
        userId: userId,
      },
    });
  }

  async delete(taskId: number, userId: number) {
    await this.validateTaskOwnership(taskId, userId);
    await this.prisma.task.delete({
      where: { id: taskId },
    });
    return { message: 'Task deleted successfully' };
  }
}
