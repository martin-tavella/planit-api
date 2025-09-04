import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dtos/createTask.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { TaskPriority } from './enums/priority.enum';
import { TaskStatus } from './enums/status.enum';

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

  async getTasksForUser(
    userId: number,
    page = 1,
    limit = 5,
    priority?: TaskPriority,
    status?: TaskStatus,
    sort: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ) {
    const where: any = { userId: userId };
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    const orderBy: any = { createdAt: sort.toLowerCase() };

    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
