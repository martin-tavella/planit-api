import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import 'multer';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly userService: UsersService,
  ) {}

  @Post('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserImage(
    @CurrentUser() user: { userId: number; email: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadCloudinary(image);
    return this.userService.updatePicture(user.userId, url);
  }
}
