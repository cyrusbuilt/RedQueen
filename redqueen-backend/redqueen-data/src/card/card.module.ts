import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { AccessControlUser } from './entity/access-control-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlUser, Card])],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
