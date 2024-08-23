/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_upload')
export class FileUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar', // Явно указываем строковый тип
    length: 500, // Максимальная длина строки
    nullable: false // Убедимся, что поле обязательно для заполнения
  })
  url: string;
}