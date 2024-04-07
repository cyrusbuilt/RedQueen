import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginHistory } from './entity/login_history.entity';
import { PaginationService } from '../pagination/pagination.service';
import { LoginHistoryDto } from './dto/login_history.dto';
import { PaginatedLoginHistoryDto } from './dto/paginated_login_history.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
    private readonly paginationService: PaginationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async findAll(): Promise<User[]> {
    this.logger.info('Fetching all users ...');
    return await this.usersRepository.find();
  }

  public async findOne(email: string): Promise<User | null> {
    this.logger.info(`Fetching user (email: ${email}) ...`);
    return await this.usersRepository.findOneBy({ email: email });
  }

  public async findOneById(id: string): Promise<User | null> {
    this.logger.info(`Fetching user (ID: ${id}) ...`);
    return await this.usersRepository.findOneBy({ id: id });
  }

  public async create(userData: RegisterDto): Promise<User> {
    this.logger.info('Beginning user create', userData);
    const theData = userData as Omit<RegisterDto, 'password'>;
    const usr: Partial<User> = {
      ...theData,
      passwordHash: userData.password,
    };
    const newUser = this.usersRepository.create(usr);
    await this.usersRepository.save(newUser);
    this.logger.info('Created user account', newUser);
    return newUser;
  }

  public async saveUser(user: User): Promise<User> {
    this.logger.info('Beginning update user ...');
    this.logger.info(`Fetching user (ID: ${user.id}) ...`);
    const existingUser = await this.usersRepository.findOneBy({ id: user.id });
    if (existingUser) {
      existingUser.modifiedAt = new Date();
      existingUser.firstName = user.firstName;
      existingUser.lastName = user.lastName;
      existingUser.role = user.role;
      existingUser.passwordHash = user.passwordHash;

      const result = await this.usersRepository.save(existingUser);
      this.logger.info('User updated', result);
      return result;
    }

    this.logger.error(`User does not exist (ID: ${user.id})!`);
    throw new Error('User does not exist');
  }

  public async logAccess(userId: string): Promise<void> {
    const record: LoginHistory = new LoginHistory();
    record.applicationUserId = userId;
    record.timestamp = new Date();
    this.logger.info(`Logging access for user (ID: ${userId}) ...`);
    await this.loginHistoryRepository.save(record);
  }

  public async getLoginHistory(
    userId: string,
    pageSize?: number,
    currentPage?: number,
  ): Promise<PaginatedLoginHistoryDto> {
    this.logger.info(`Fetching login history for user (ID: ${userId}) ...`);
    const skipCalculated = this.paginationService.calcSkip(
      pageSize,
      currentPage,
    );

    let selectColumns = 'log.id as id, ';
    selectColumns += 'log.user_id as applicationUserId, ';
    selectColumns += 'usr.email as email, ';
    selectColumns += 'log.timestamp as timestamp';

    let query = this.usersRepository
      .createQueryBuilder('usr')
      .select(selectColumns)
      .innerJoin('login_history', 'log', 'usr.id = log.user_id')
      .where('log.user_id = :id', { id: userId })
      .addGroupBy('log.id, log.user_id, usr.email, log.timestamp')
      .orderBy('log.timestamp', 'DESC');

    const countQuery = query.clone();
    const total = await countQuery.getCount();
    this.logger.info(`Found ${total} results.`);

    query = query.skip(skipCalculated).take(pageSize);
    const result = (await query.getRawMany()) as LoginHistoryDto[];
    const response = new PaginatedLoginHistoryDto(
      pageSize || 20,
      currentPage || 1,
      total,
      pageSize ? Math.ceil(total / pageSize) : 1,
    );
    response.items = result;
    this.logger.info(
      `Returning page ${response.recordCount} of ${response.totalPages} results for user (ID: ${userId})`,
    );
    return response;
  }
}
