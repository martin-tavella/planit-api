import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TaskStatus } from '../enums/status.enum';
import { TaskPriority } from '../enums/priority.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: 'pending' | 'in_progress' | 'completed';

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsDate()
  deadline?: Date;
}
