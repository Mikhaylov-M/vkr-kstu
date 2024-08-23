/* eslint-disable prettier/prettier */

import { BaseEntity } from 'src/base.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserInterface, UserStatus } from './user.types';
import { hash } from 'bcrypt';
import { Confirmation } from 'src/confirmation/confirmation.entity';
import { UserRole } from 'src/userRole/userRole.entity';
import { Storage } from 'src/storage/storage.entity';
import { Product } from 'src/product/product.entity';
import { Statistics } from 'src/statistics/entities/statistic.entity';

@Entity('one_users') // Убедитесь, что таблица 'one_users' существует
export class User extends BaseEntity implements UserInterface {
  @Column({
    type: 'varchar', // Строковой тип
    length: 50, // Максимальная длина строки
    nullable: false, // Поле обязательно для заполнения
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  surname: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true, // Уникальное значение
  })
  personal_code: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  dateOfBirth: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  residenceCity: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true, // Уникальное значение для электронной почты
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum', // Перечисление
    enum: UserStatus,
    nullable: false,
  })
  status: UserStatus;

  @ManyToMany(() => UserRole)
  @JoinTable()
  roles: UserRole[];

  @ManyToOne(() => Confirmation)
  emailConfirmation: Confirmation;

  @OneToMany(() => Product, (product) => product.user, { eager: true })
  products: Product[];

  @OneToMany(() => Statistics, (statistics) => statistics.user)
  statistics: Statistics[];

  @ManyToOne(() => Storage)
  storage: Storage;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
    this.createdAt = new Date();
  }
}