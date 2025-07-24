import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
    ConfigService,
  ],
})
export class UploadModule {}
