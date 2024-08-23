/* eslint-disable prettier/prettier */
import { BaseEntity } from 'src/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Storage extends BaseEntity {
  @Column({
    type: 'varchar', // Явно указываем тип строки
    length: 100, // Укажите максимальную длину строки, при необходимости
    nullable: false
  })
  address1: string;

  @Column({
    type: 'varchar', // Определяем тип строки
    length: 100, // Аналогично первому адресу
    nullable: false
  })
  address2: string;

  @Column({
    type: 'varchar', // Телефон также строка
    length: 15, // Максимальная длина телефонного номера
    nullable: false
  })
  phone: string;

  @Column({
    type: 'boolean', // Тип булево
    default: false,
    nullable: false
  })
  isActive: boolean;
}