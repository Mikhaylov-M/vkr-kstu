/* eslint-disable prettier/prettier */
import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';
import { UserRoleName } from './userRole.types';

@Entity('user_roles')
export class UserRole extends BaseEntity {
  @Column({
    type: 'enum',
    enum: UserRoleName,
    unique: true,
    nullable: false
  })
  roleName: UserRoleName;
}