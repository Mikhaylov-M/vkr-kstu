/* eslint-disable prettier/prettier */

import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ProductStatus } from './product.types';
import { BaseEntity } from 'src/base.entity';
import { Statistics } from 'src/statistics/entities/statistic.entity';

@Entity('excel_data')
export class Product extends BaseEntity {
  @Column({
    type: 'enum', // Указываем тип данных как перечисление
    enum: ProductStatus, // Используем перечисление ProductStatus
    nullable: false
  })
  status: ProductStatus;

  @Column({
    type: 'date', // Указываем явный тип даты
    nullable: true
  })
  date: Date;

  @Column({
    type: 'varchar', // Явно указываем строковый тип
    length: 20, // Указываем максимальную длину строки
    nullable: false
  })
  userCode: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  trackCodeOfTheProduct: string;

  @Column({
    type: 'varchar', // Можно изменить на другой числовой тип, если требуется
    length: 10,
    nullable: true
  })
  weight: string;

  @ManyToOne(() => User, (user) => user.products, { nullable: true })
  user: User;

  @OneToOne(() => Statistics)
  @JoinColumn()
  statistics: Statistics;

  @Column({
    type: 'float8', // Явно указываем числовой тип с плавающей точкой
    nullable: true
  })
  deliveryCost: number;
}