import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entity/device.entity';
import { Repository } from 'typeorm';
import { MqttBroker } from './entity/mqtt-broker.entity';
import { MqttMessage } from './entity/mqtt-message.entity';
import { MqttTopic } from './entity/mqtt-topic.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PaginatedDevices } from './dto/paginated-devices.dto';
import { MqttBrokerDto } from './dto/mqtt-broker.dto';
import { DeviceDto } from './dto/device.dto';
import { Utils } from '../common/utils';
import { PaginatedMessages } from './dto/paginated-messages.dto';
import { MqttTopicDto } from './dto/mqtt-topic.dto';

@Injectable()
export class RedqueenService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(MqttBroker)
    private readonly brokerRepository: Repository<MqttBroker>,
    @InjectRepository(MqttMessage)
    private readonly messageRepository: Repository<MqttMessage>,
    @InjectRepository(MqttTopic)
    private readonly topicRepository: Repository<MqttTopic>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async getTopicsForBroker(brokerId: number): Promise<MqttTopic[]> {
    this.logger.info(`Fetching topics (broker ID: ${brokerId}) ...`);
    return await this.topicRepository.find({
      where: { brokerId: brokerId },
    });
  }

  public async getMqttBrokers(activeOnly: boolean): Promise<MqttBroker[]> {
    this.logger.info(`Fetching brokers (active only: ${activeOnly}) ...`);
    const brokers = await this.brokerRepository.find({
      where: activeOnly ? { isActive: true } : undefined,
    });
    for (const b of brokers) {
      b.topics = await this.getTopicsForBroker(b.id);
    }

    return brokers;
  }

  public async getBrokerByHost(host: string): Promise<MqttBroker | null> {
    this.logger.info(`Fetching broker (host: ${host}) ...`);
    const broker = await this.brokerRepository
      .createQueryBuilder()
      .where('LOWER(broker_host) = LOWER(:host)', { host })
      .getOne();
    if (broker) {
      broker.topics = await this.getTopicsForBroker(broker.id);
    }

    return broker;
  }

  public async topicExists(topic: string): Promise<boolean> {
    this.logger.info(`Checking topic existence (name: ${topic}) ...`);
    return await this.topicRepository
      .createQueryBuilder('MqttTopic')
      .leftJoinAndSelect('MqttTopic.broker', 'broker')
      .where('LOWER(topic_name) = LOWER(:topic)', { topic })
      .getExists();
  }

  public async getTopic(topic: string): Promise<MqttTopic | null> {
    this.logger.info(`Fetching topic (name: ${topic}) ...`);
    return await this.topicRepository
      .createQueryBuilder('MqttTopic')
      .leftJoinAndSelect('MqttTopic.broker', 'broker')
      .where('LOWER(topic_name) = LOWER(:topic)', { topic })
      .getOne();
  }

  public async getTopicById(topicId: number): Promise<MqttTopic | null> {
    this.logger.info(`Fetching topic (ID: ${topicId}) ...`);
    return await this.topicRepository.findOne({
      where: { id: topicId },
    });
  }

  public async saveTopic(
    topicName: string,
    brokerId: number,
  ): Promise<boolean> {
    this.logger.info('Beginning save topic ...', { topicName, brokerId });
    const exists = await this.topicExists(topicName);
    if (exists) {
      this.logger.warn('Topic already exists', { topicName, brokerId });
      return false;
    }

    const topic: Partial<MqttTopic> = {
      name: topicName,
      brokerId: brokerId,
      isActive: true,
    };

    await this.topicRepository.save(topic);
    this.logger.info('Topic save successfully');
    return true;
  }

  public async saveMqttMessage(
    message: string,
    topicId: number,
    clientId: string,
  ): Promise<void> {
    this.logger.info('Beginning save message...', {
      message,
      topicId,
      clientId,
    });
    const msg: Partial<MqttMessage> = {
      content: message,
      topicId: topicId,
      clientId: clientId,
      timestamp: new Date(),
    };

    await this.messageRepository.save(msg);
    this.logger.info('Message save succesfully');
  }

  public async getDevices(activeOnly: boolean): Promise<Device[]> {
    this.logger.info(`Fetching devices (active only: ${activeOnly}) ...`);
    return await this.deviceRepository.find({
      relations: { controlTopic: true, statusTopic: true },
      where: activeOnly ? { isActive: true } : undefined,
    });
  }

  public async getDevicesPaged(
    pageSize: number,
    currentPage: number,
    activeOnly: boolean,
  ): Promise<PaginatedDevices> {
    this.logger.info(
      `Beginning device lookup. pageSize: ${pageSize}, currentPage: ${currentPage}, activeOnly: ${activeOnly} ...`,
    );

    const skip = (currentPage - 1) * pageSize;
    let query = this.deviceRepository
      .createQueryBuilder('Device')
      .leftJoinAndSelect('Device.statusTopic', 'statusTopic')
      .leftJoinAndSelect('Device.controlTopic', 'controlTopic');
    if (activeOnly) {
      query = query.where('is_active = true');
    }

    query = query.orderBy('Device.name').skip(skip).take(pageSize);

    const count = await query.getCount();
    this.logger.info(`Found ${count} devices.`);

    const totalPages = Math.ceil(count / pageSize);
    const deviceMatches = await query.getMany();
    const result = new PaginatedDevices(
      pageSize,
      currentPage,
      count,
      totalPages,
    );

    result.items = deviceMatches;
    return result;
  }

  public async saveBroker(broker: MqttBrokerDto): Promise<MqttBroker | null> {
    this.logger.info('Beginning save broker ...');
    const existingBroker = await this.getBrokerByHost(broker.host);
    if (existingBroker) {
      this.logger.warn(`No matching broker found (host: ${broker.host}).`);
      return null;
    }

    const newBroker: Partial<MqttBroker> = {
      host: broker.host,
      port: broker.port,
      username: broker.username,
      password: broker.password,
      useTLS: broker.useTLS,
      keepAliveSeconds: broker.keepAliveSeconds,
      webSocketsPort: broker.webSocketsPort,
      discoveryTopic: broker.discoveryTopic,
    };

    this.logger.info('Saving new broker', newBroker);
    return await this.brokerRepository.save(newBroker);
  }

  public async getBrokerById(brokerId: number): Promise<MqttBroker | null> {
    this.logger.info(`Fetching broker (ID: ${brokerId}) ...`);
    return await this.brokerRepository.findOne({
      where: { id: brokerId },
    });
  }

  public async updateBroker(
    id: number,
    broker: MqttBrokerDto,
  ): Promise<MqttBroker | null> {
    this.logger.info('Beginning update broker ...');
    const existingBroker = await this.getBrokerById(id);
    if (existingBroker) {
      this.logger.warn(`No matching broker found (ID: ${id}).`);
      return null;
    }

    existingBroker.modifiedDate = new Date();
    existingBroker.host = broker.host;
    existingBroker.port = broker.port;
    existingBroker.username = broker.username;
    existingBroker.password = broker.password;
    existingBroker.isActive = broker.isActive;
    existingBroker.useTLS = broker.useTLS;
    existingBroker.keepAliveSeconds = broker.keepAliveSeconds;
    existingBroker.discoveryTopic = broker.discoveryTopic;
    existingBroker.webSocketsPort = broker.webSocketsPort;

    this.logger.info('Updating broker', existingBroker);
    await this.brokerRepository.save(existingBroker);
    return existingBroker;
  }

  public async getTopics(activeOnly: boolean): Promise<MqttTopic[]> {
    this.logger.info(`Fetching topics (active only: ${activeOnly}) ...`);
    return await this.topicRepository.find({
      where: activeOnly ? { isActive: true } : undefined,
    });
  }

  public async updateTopic(
    topicId: number,
    topic: MqttTopicDto,
  ): Promise<MqttTopic | null> {
    this.logger.info('Beginning update topic ...');
    const existingTopic = await this.getTopicById(topicId);
    if (!existingTopic) {
      this.logger.warn(`No matching topic found (ID: ${topicId}).`);
      return null;
    }

    existingTopic.name = topic.name;
    existingTopic.brokerId = topic.brokerId;
    existingTopic.isActive = topic.isActive;
    existingTopic.modifiedDate = new Date();

    this.logger.info('Updating topic', existingTopic);
    await this.topicRepository.save(existingTopic);
    return existingTopic;
  }

  public async getDeviceById(deviceId: number): Promise<Device | null> {
    this.logger.info(`Fetching device (ID: ${deviceId}) ...`);
    return await this.deviceRepository.findOne({
      where: { id: deviceId },
      relations: { controlTopic: true, statusTopic: true },
    });
  }

  public async updateDevice(
    deviceId: number,
    device: DeviceDto,
  ): Promise<Device | null> {
    this.logger.info('Beginning update device ...');
    const existingDevice = await this.getDeviceById(deviceId);
    if (!existingDevice) {
      this.logger.warn(`No matching device found (ID: ${deviceId}).`);
      return null;
    }

    existingDevice.name = Utils.isNullOrWhitespace(device.name)
      ? device.friendlyName
      : device.name;
    existingDevice.friendlyName = Utils.isNullOrWhitespace(device.friendlyName)
      ? device.name
      : device.friendlyName;
    existingDevice.controlTopicId = device.controlTopicId;
    existingDevice.statusTopicId = device.statusTopicId;
    existingDevice.isActive = device.isActive;
    existingDevice.modifiedDate = new Date();
    existingDevice.class = device.class;

    this.logger.info('Updating device', existingDevice);
    await this.deviceRepository.save(existingDevice);

    // Also activate/deactivate any associated topics
    const statusTopic = await this.getTopicById(existingDevice.statusTopicId);
    if (statusTopic) {
      statusTopic.isActive = existingDevice.isActive;
      this.logger.info('Updating topic', statusTopic);
      await this.topicRepository.save(statusTopic);
    }

    if (existingDevice.controlTopicId) {
      const controlTopic = await this.getTopicById(
        existingDevice.controlTopicId,
      );
      if (controlTopic) {
        controlTopic.isActive = existingDevice.isActive;
        this.logger.info('Updating topic', controlTopic);
        await this.topicRepository.save(controlTopic);
      }
    }

    return existingDevice;
  }

  public async addDevice(device: DeviceDto): Promise<Device | null> {
    this.logger.info('Beginning add device ...');
    this.logger.info(`Checking for existing device (name: ${device.name}) ...`);
    const dev = await this.deviceRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name: device.name })
      .getOne();
    if (dev) {
      return null;
    }

    const newDevice: Partial<Device> = {
      name: Utils.isNullOrWhitespace(device.name)
        ? device.friendlyName
        : device.name,
      friendlyName: Utils.isNullOrWhitespace(device.friendlyName)
        ? device.name
        : device.friendlyName,
      statusTopicId: device.statusTopicId,
      controlTopicId: device.controlTopicId,
      class: device.class,
    };

    this.logger.info('Adding device', newDevice);
    return await this.deviceRepository.save(newDevice);
  }

  public async getMessages(): Promise<MqttMessage[]> {
    this.logger.info('Fetching all device messages ...');
    return this.messageRepository.find();
  }

  public async getPagedMessages(
    pageSize: number,
    currentPage: number,
  ): Promise<PaginatedMessages> {
    this.logger.info(
      `Beginning message lookup. pageSize: ${pageSize}, currentPage: ${currentPage} ...`,
    );

    const skip = (currentPage - 1) * pageSize;
    const count = await this.messageRepository.count();
    this.logger.info(`Found ${count} messages.`);

    const totalPages = Math.ceil(count / pageSize);
    const messageMatches = await this.messageRepository.find({
      skip: skip,
      take: pageSize,
      order: {
        id: 'DESC',
      },
      relations: {
        topic: true,
      },
    });
    const result = new PaginatedMessages(
      pageSize,
      currentPage,
      count,
      totalPages,
    );

    result.items = messageMatches;
    return result;
  }
}
