import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Head,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MqttBroker,
  MqttBrokerDto,
  MqttMessage,
  MqttTopic,
  MqttTopicDto,
  PaginatedMessages,
  RedqueenService,
} from '@redqueen-backend/redqueen-data';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GeneralResponseDto } from 'src/common/models/general-response.dto';
import Utils from 'src/common/utils';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
import { version } from '../../package.json';
import Configuration from 'src/configuration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@UseGuards(JwtAuthGuard)
@ApiTags('telemetry')
@Controller('api/telemetry')
export class TelemetryManagementController {
  constructor(
    private readonly redqueenDataService: RedqueenService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('brokers')
  @ApiOperation({ description: 'Gets a list of all known MQTT brokers' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [MqttBroker],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async getBrokers(): Promise<MqttBroker[]> {
    try {
      return await this.redqueenDataService.getMqttBrokers(false);
    } catch (e: any) {
      this.logger.error('Failed to retrieve brokers', e);
      throw new InternalServerErrorException(e);
    }
  }

  @Head('brokers')
  @ApiOperation({
    description: 'HEAD servicer for get brokers endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getBrokersHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Post('brokers/add')
  @ApiOperation({ description: 'Adds a new MQTT broker' })
  @ApiBody({ type: MqttBrokerDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttBroker,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Broker already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async addBroker(@Body() broker: MqttBrokerDto): Promise<MqttBroker> {
    try {
      const result = await this.redqueenDataService.saveBroker(broker);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Broker already exists');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('brokers/add')
  @ApiOperation({
    description: 'HEAD servicer for add broker endpoint (legacy support)',
  })
  @ApiBody({ type: MqttBrokerDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public addBrokerHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() broker: MqttBrokerDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Put('brokers/:id')
  @ApiOperation({ description: 'Updates an existing MQTT broker' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttBrokerDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttBroker,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching broker not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async updateBroker(
    @Param('id') id: number,
    @Body() broker: MqttBrokerDto,
  ): Promise<MqttBroker> {
    try {
      const result = await this.redqueenDataService.updateBroker(id, broker);
      if (!result) {
        const err = new GeneralResponseDto(
          'Error',
          'Matching broker not found',
        );
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('legacy/brokers/:id')
  @ApiOperation({
    description: 'Updates an existing MQTT broker (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttBrokerDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttBroker,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching broker not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async updateBrokerLegacy(
    @Param('id') id: number,
    @Body() broker: MqttBrokerDto,
  ): Promise<MqttBroker> {
    return await this.updateBroker(id, broker);
  }

  @Head('legacy/brokers/:id')
  @ApiOperation({
    description:
      'HEAD servicer for legacy update broker endpoint (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttBrokerDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public updateBrokerLegacyHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() broker: MqttBrokerDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('brokers/:id')
  @ApiOperation({ description: 'Gets an MQTT broker by record ID' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttBroker,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async getBrokerById(@Param('id') id: number): Promise<MqttBroker> {
    try {
      return await this.redqueenDataService.getBrokerById(id);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('brokers/:id')
  @ApiOperation({
    description: 'HEAD servicer for get broker by ID endpoint (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getBrokerByIdHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('topics')
  @ApiOperation({ description: 'Gets a list of all known MQTT topics' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [MqttTopic],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async getTopics(): Promise<MqttTopic[]> {
    try {
      return await this.redqueenDataService.getTopics(false);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('topics')
  @ApiOperation({
    description: 'HEAD servicer for get MQTT topics endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getTopicsHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('topics/:id')
  @ApiOperation({ description: 'Updates an existing MQTT topic' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttTopicDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttTopic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching topic not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async updateTopic(
    @Param('id') id: number,
    @Body() topic: MqttTopicDto,
  ): Promise<MqttTopic> {
    try {
      const result = this.redqueenDataService.updateTopic(id, topic);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Matching topic not found');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('legacy/topics/:id')
  @ApiOperation({
    description: 'Updates an existing MQTT topic (legacy support) ',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttTopicDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttTopic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching topic not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async updateTopicLegacy(
    @Param('id') id: number,
    @Body() topic: MqttTopicDto,
  ): Promise<MqttTopic> {
    return await this.updateTopic(id, topic);
  }

  @Head('legacy/topics/:id')
  @ApiOperation({
    description:
      'HEAD servicer for legacy update topic endpoint (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: MqttTopicDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public updateTopicLegacyHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() topic: MqttTopicDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Post('topics/add')
  @ApiOperation({ description: 'Adds a new MQTT topic' })
  @ApiBody({ type: MqttTopicDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: MqttTopic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Topic already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async addTopic(@Body() topic: MqttTopicDto): Promise<MqttTopic> {
    try {
      const succes = await this.redqueenDataService.saveTopic(
        topic.name,
        topic.brokerId,
      );
      if (!succes) {
        const err = new GeneralResponseDto('Error', 'Topic already exists');
        throw new BadRequestException(err);
      }

      return await this.redqueenDataService.getTopic(topic.name);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('topics/add')
  @ApiOperation({
    description: 'HEAD servicer for add topic endpoint (legacy support)',
  })
  @ApiBody({ type: MqttTopicDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public addTopicHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() topic: MqttTopicDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('brokers/:brokerId/topics')
  @ApiParam({ name: 'brokerId', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [MqttTopic],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async getTopicsForBroker(
    @Param('brokerId') brokerId: number,
  ): Promise<MqttTopic[]> {
    try {
      return await this.redqueenDataService.getTopicsForBroker(brokerId);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }
  @Head('brokers/:brokerId/topics')
  @ApiParam({ name: 'brokerId', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getTopicsForBrokerHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('brokerId') brokerId: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('messages')
  @ApiOperation({ description: 'Gets a pages list of MQTT messages' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [MqttMessage],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: Error,
  })
  public async getMessages(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): Promise<PaginatedMessages> {
    try {
      return await this.redqueenDataService.getPagedMessages(
        pageSize,
        currentPage,
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('messages')
  @ApiOperation({
    description: 'HEAD servicer for get messages endpoint (legacy support)',
  })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getMessagesHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('systemTelemetry')
  @ApiOperation({ description: 'Gets system telemetry info' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: TelemetryResponseDto,
  })
  public getSystemTelemetry(): TelemetryResponseDto {
    const telem = new TelemetryResponseDto(
      version,
      Configuration.shared.daemonStatusTopic,
      Configuration.shared.daemonControlTopic,
    );
    return telem;
  }

  @Get('systemTelemetry')
  @ApiOperation({
    description:
      'HEAD servicer for get system telemetry endpoing (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getSystemTelemetryHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }
}
