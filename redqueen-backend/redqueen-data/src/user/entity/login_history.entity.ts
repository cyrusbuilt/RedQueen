import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('login_history')
export class LoginHistory {
  @ApiProperty({
    description: 'The record ID',
    example: '125',
    type: 'integer',
  })
  @PrimaryColumn()
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user being logged',
    example: '1AB3D7609873BHG7711',
    type: 'string',
  })
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  applicationUserId: string;

  @IsDate()
  @ApiProperty({
    description: 'Timestamp of when the user logged in',
    example: '2024-01-31T13:08:52.221',
    type: 'timestamp',
  })
  @Column({ name: 'timestamp', type: 'timestamp', nullable: false })
  timestamp: Date;
}
