import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessControlUser } from './entity/access-control-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PaginatedCards } from './dto/paginated-cards.dto';
import { PaginatedAccessControlUsers } from './dto/paginated-access-control-users.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(AccessControlUser)
    private readonly accessControlUserRepository: Repository<AccessControlUser>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async getCards(
    pageSize: number,
    currentPage: number,
  ): Promise<PaginatedCards> {
    this.logger.info(
      `Beginning card lookup: pageSize: ${pageSize}, currentPage: ${currentPage} ...`,
    );

    const skip = (currentPage - 1) * pageSize;
    const count = await this.cardRepository.count();
    this.logger.info(`Found ${count} cards.`);

    const totalPages = Math.ceil(count / pageSize);
    const cardMatches = await this.cardRepository.find({
      relations: {
        accessControlUser: true,
      },
      skip: skip,
      take: pageSize,
    });

    const result = new PaginatedCards(pageSize, currentPage, count, totalPages);
    result.items = cardMatches;
    return result;
  }

  public async getActiveUsers(): Promise<AccessControlUser[]> {
    this.logger.info('Fetching all active access control users ...');
    return await this.accessControlUserRepository.findBy({ isActive: true });
  }

  public async updateCard(card: Partial<Card>): Promise<Card | null> {
    this.logger.info('Beginning update card', card);
    this.logger.info(`Fetching card (ID: ${card.id}) ...`);

    const existingCard = await this.cardRepository.findOne({
      where: { id: card.id },
    });
    if (!existingCard) {
      this.logger.warn(`Matching card not found (ID: ${card.id}).`);
      return null;
    }

    existingCard.serial = card.serial;
    existingCard.isActive = card.isActive;
    existingCard.accessControlUserId = card.accessControlUserId;
    existingCard.accessControlUser = card.accessControlUser;
    existingCard.modifiedDate = new Date();

    this.logger.info('Updating card', existingCard);
    await this.cardRepository.save(existingCard);
    return existingCard;
  }

  public async addCard(card: Partial<Card>): Promise<Card | null> {
    this.logger.info('Beginning add card ...', card);
    this.logger.info(`Fetching card (serial: ${card.serial}) ...`);

    const existingCard = await this.cardRepository
      .createQueryBuilder()
      .where('LOWER(serial) = LOWER(:serial)', { serial: card.serial })
      .getOne();
    if (existingCard) {
      this.logger.warn(`Card already exists (ID: ${existingCard.id}.`);
      return null;
    }

    this.logger.info('Updating card', card);
    return await this.cardRepository.save(card);
  }

  public async getCardUsers(
    pageSize: number,
    currentPage: number,
  ): Promise<PaginatedAccessControlUsers> {
    this.logger.info(
      `Beginning access control user lookup. pageSize: ${pageSize}, currentPage: ${currentPage} ...`,
    );

    const skip = (currentPage - 1) * pageSize;
    const count = await this.accessControlUserRepository.count();
    this.logger.info(`Found ${count} cards.`);

    const totalPages = Math.ceil(count / pageSize);
    const userMatches = await this.accessControlUserRepository.find({
      take: pageSize,
      skip: skip,
    });

    const result = new PaginatedAccessControlUsers(
      pageSize,
      currentPage,
      count,
      totalPages,
    );

    result.items = userMatches;
    return result;
  }

  public async getCardUserById(
    userId: number,
  ): Promise<AccessControlUser | null> {
    this.logger.info(`Fetching AC user (ID: ${userId}) ...`);
    return await this.accessControlUserRepository.findOne({
      where: { id: userId },
    });
  }

  public async updateCardUser(
    user: Partial<AccessControlUser>,
  ): Promise<AccessControlUser | null> {
    this.logger.info('Beginning update card user ...', user);

    const existingUser = await this.getCardUserById(user.id);
    if (!existingUser) {
      this.logger.warn(`No matching AC user found (ID: ${user.id}.`);
      return null;
    }

    existingUser.name = user.name;
    existingUser.pin = user.pin;
    existingUser.isActive = user.isActive;
    existingUser.modifiedDate = new Date();

    this.logger.info('Updating AC user ...', existingUser);
    return await this.accessControlUserRepository.save(existingUser);
  }

  public async addCardUser(
    user: Partial<AccessControlUser>,
  ): Promise<AccessControlUser | null> {
    this.logger.info('Beginning add card user ...');
    const existingUser = await this.getCardUserById(user.id);
    if (existingUser) {
      this.logger.warn(`AC user already exists (ID: ${user.id}).`);
      return null;
    }

    return await this.accessControlUserRepository.save(user);
  }
}
