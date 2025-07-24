import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [TasksModule, UsersModule, AuthModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
