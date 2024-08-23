/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from './file-upload.service';
import { UploadController } from './file-upload.controller';
import { FileUpload } from './entities/file-upload.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'uploads'), // Путь к директории с загруженными файлами
      serveRoot: '/uploads', // Корень URL, по которому будут доступны загруженные файлы
    }),
  ],
  controllers: [UploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
