import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../../helper_types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

@Entity({ name: 'user' })
export class User {
  @ApiProperty({
    description: 'The user ID',
    example: 'ade1a7d3-b77d-4647-a5d5-9324d4150546',
    type: 'string',
  })
  @PrimaryGeneratedColumn()
  id: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The timestamp of when the user was created',
    example: new Date().toUTCString(),
    type: 'timestamp',
    default: '[current timestamp]',
  })
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;

  @IsDate()
  @ApiProperty({
    description: 'The timestamp of when the user was last modified',
    example: new Date().toUTCString(),
    required: false,
    type: 'timestamp',
    nullable: true,
  })
  @Column({
    name: 'modified_at',
    type: 'timestamp with time zone',
    nullable: false,
  })
  modifiedAt: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: "The user's email address",
    example: 'jane.doe@some.domain',
    type: 'string',
    maxLength: 255,
  })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({
    description: "The user's first name",
    example: 'jane',
    type: 'string',
    maxLength: 50,
    required: false,
  })
  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  firstName: string | null;

  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: "The user's last name",
    example: 'doe',
    type: 'string',
    maxLength: 100,
    required: false,
  })
  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description:
      "The user's password hash. Should always be null in API responses.",
    example: 'null',
    type: 'string',
    maxLength: 255,
    required: false,
  })
  @Column({
    name: 'passwordhash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordHash: string | null;

  @ApiProperty({
    description: "The user's role. Admin or User.",
    example: 'user',
  })
  @Column({
    name: 'role',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag that indicates whether or not the user is locked out.',
    example: 'false',
  })
  @Column({
    name: 'locked_out',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  lockoutEnabled: boolean;
}
