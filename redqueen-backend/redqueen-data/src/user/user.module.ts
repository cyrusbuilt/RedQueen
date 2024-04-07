import { Global, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { LoginHistory } from './entity/login_history.entity';
import { PaginationModule } from '../pagination/pagination.module';

@Global()
@Module({
  imports: [PaginationModule, TypeOrmModule.forFeature([User, LoginHistory])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
