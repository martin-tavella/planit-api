import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TasksModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
