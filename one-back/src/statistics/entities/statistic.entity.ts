/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum DeliveryLevel {
  Standard = 'Standard',
  Gold = 'Gold',
  Platinum = 'Platinum',
}

@Entity('one_statistics')
export class Statistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar', // Указываем тип строки
    length: 50, // При необходимости, уточните максимальную длину
    nullable: false
  })
  personal_code: string;

  @ManyToOne(() => User, (user) => user.statistics)
  user: User;

  @Column({
    type: 'int', // Числовой тип
    nullable: false
  })
  month: number;

  @Column({
    type: 'int', // Количество заказов, числовой тип
    nullable: false
  })
  total_orders: number;

  @Column({
    type: 'decimal', // Десятичный тип для веса
    precision: 10, // Примерное количество цифр до запятой
    scale: 2, // Количество десятичных знаков после запятой
    nullable: false
  })
  total_weight: number;

  @Column({
    type: 'decimal', // Десятичный тип для суммы
    precision: 10,
    scale: 2,
    nullable: false
  })
  total_paid: number;

  @Column({
    type: 'enum',
    enum: DeliveryLevel,
    default: DeliveryLevel.Standard
  })
  deliveryLevel: DeliveryLevel; // Заменяем на соответствующий тип перечисления
}