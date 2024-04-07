import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MqttMessage } from '../redqueen/entity/mqtt-message.entity';
import { MoreThan, Repository } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class HistoricalDataService {
  constructor(
    @InjectRepository(MqttMessage)
    private readonly messageRepository: Repository<MqttMessage>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async getHistoricalDataForClient(
    topicId: number,
    numDays: number,
  ): Promise<MqttMessage[]> {
    this.logger.info(
      `Fetching client messages (topic ID: ${topicId}, num days: ${numDays}) ...`,
    );
    const numDaysAgo = new Date();
    numDaysAgo.setDate(numDaysAgo.getDate() - numDays);
    return await this.messageRepository.find({
      relations: { topic: true },
      where: {
        topicId: topicId,
        timestamp: MoreThan(numDaysAgo),
      },
      order: {
        timestamp: 'desc',
      },
    });
  }
}
