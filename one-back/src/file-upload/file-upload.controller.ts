/* eslint-disable prettier/prettier */
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('uploads')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const savedFile = await this.fileUploadService.saveFile(file);
    return savedFile;
  }
  @Get()
  async getFiles() {
    const files = await this.fileUploadService.getFiles();
    return files;
  }
  @Get(':id')
  async getFile(@Param('id') id: number) {
    const file = await this.fileUploadService.getFile(id);
    return file;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@Param('id') id: number, @UploadedFile() file) {
    const updatedFile = await this.fileUploadService.updateFile(id, file);
    return updatedFile;
  }
  // @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    return this.fileUploadService.downloadFile(id, res);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    await this.fileUploadService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
