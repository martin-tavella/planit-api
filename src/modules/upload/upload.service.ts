import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import 'multer';

@Injectable()
export class UploadService {
  constructor() {}
  async uploadCloudinary(file: Express.Multer.File) {
    const uploadPromise: Promise<UploadApiResponse> = new Promise(
      (resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          },
        );
        toStream(file.buffer).pipe(upload);
      },
    );

    const cloudinaryResponse = await Promise.resolve(uploadPromise);
    return cloudinaryResponse.url;
  }
}
