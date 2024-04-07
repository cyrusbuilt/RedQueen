import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AccessControlUser } from './access-control-user.entity';
import { ManyToOne } from 'typeorm';

@Entity('card')
export class Card {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the card',
    example: 2,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'The serial number of the card',
    example: '123456789',
    type: 'string',
    maxLength: 50,
  })
  @Column({ name: 'serial', type: 'varchar', length: 50 })
  serial: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of when the card was created',
    example: new Date().toUTCString(),
    default: '[current date]',
    type: 'date',
  })
  @Column({
    name: 'created_date',
    type: 'timestamp',
    default: new Date().toUTCString(),
  })
  createdDate: Date;

  @IsDate()
  @ApiProperty({
    description: 'Date of when the card was last modified',
    example: new Date().toUTCString(),
    type: 'date',
    required: false,
    nullable: true,
  })
  @Column({ name: 'modified_date', type: 'date', nullable: true })
  modifiedDate?: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate whether or not the card is active',
    default: true,
    example: true,
  })
  isActive: boolean;

  @IsInt()
  @ApiProperty({
    description:
      'The record ID of the access control user this card is associated with (if any)',
    example: 55,
    nullable: true,
    required: false,
  })
  @Column({ name: 'access_control_user_id', type: 'integer', nullable: true })
  accessControlUserId?: number;

  @IsInstance(AccessControlUser)
  @ApiProperty({
    description: 'The access control user associated with this card',
    type: AccessControlUser,
    nullable: true,
    required: false,
  })
  @ManyToOne(() => AccessControlUser, (user) => user.cards)
  @JoinColumn({ name: 'access_control_user_id', referencedColumnName: 'id' })
  accessControlUser?: AccessControlUser;
}
