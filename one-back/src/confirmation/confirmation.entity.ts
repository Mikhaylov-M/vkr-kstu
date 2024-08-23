// confirmation.entity.ts

import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base.entity';
import { ConfirmationStatus, EmailConfirmation } from './confirmation.types';

@Entity()
export class Confirmation extends BaseEntity implements EmailConfirmation {
  @Column({
    type: 'varchar', // явно указываем тип
    length: 50, // задайте необходимую длину
    nullable: false
  })
  code: string;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ConfirmationStatus, // используем тип enum
    default: ConfirmationStatus.PENDING
  })
  confirmationStatus: ConfirmationStatus;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  expirationDateTime?: Date;

  @Column({
    type: 'int',
    nullable: true
  })
  attempts?: number;
}
