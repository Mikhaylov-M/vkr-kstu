/* eslint-disable prettier/prettier */
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { Response } from 'express';
@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
  ) {}

  async saveFile(file): Promise<FileUpload> {
    const originalname = path.parse(file.originalname).name;
    const extension = path.parse(file.originalname).ext;
    const timestamp = Date.now();
    const filename = `${originalname}_${timestamp}${extension}`;

    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (err) {
      console.error(`Error creating directory: ${err.message}`);
    }

    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const url = `https://oneexpress.kg:8083/uploads/${filename}`;
    const newFile = this.fileUploadRepository.create({ url });
    return this.fileUploadRepository.save(newFile);
  }

  async getFiles(): Promise<FileUpload[]> {
    return this.fileUploadRepository.find();
  }

  async getFile(id: number): Promise<FileUpload> {
    return this.fileUploadRepository.findOne({ where: { id: id } });
  }
  async updateFile(id: number, file): Promise<FileUpload> {
    const filename = file.originalname;
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const url = `https://oneexpress.kg:8083/uploads/${filename}`;
    const fileToUpdate = await this.fileUploadRepository.findOne({
      where: { id: id },
    });
    fileToUpdate.url = url;
    return this.fileUploadRepository.save(fileToUpdate);
  }
  async downloadFile(id: number, res: Response): Promise<void> {
    const file = await this.fileUploadRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    const filePath = path.join(
      path.resolve(__dirname, '..', '..', 'uploads'),
      path.basename(file.url),
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + path.basename(file.url),
    );
    res.download(filePath);
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.fileUploadRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    const filePath = path.join(
      path.resolve(__dirname, '..', '..', 'uploads'),
      path.basename(file.url),
    );
    fs.unlinkSync(filePath);
    await this.fileUploadRepository.delete(id);
  }
}
