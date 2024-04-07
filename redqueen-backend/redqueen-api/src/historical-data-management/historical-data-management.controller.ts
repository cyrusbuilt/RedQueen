import {
  Controller,
  Get,
  Head,
  HttpStatus,
  InternalServerErrorException,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HistoricalDataService,
  MqttMessage,
} from '@redqueen-backend/redqueen-data';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import Utils from 'src/common/utils';

@UseGuards(JwtAuthGuard)
@ApiTags('historical')
@Controller('api/historicalData')
export class HistoricalDataManagementController {
  constructor(private readonly historicalDataService: HistoricalDataService) {}

  @Get('messages')
  @ApiOperation({
    description:
      'Gets all device messages for a given topic and number of days',
  })
  @ApiQuery({ name: 'topicId', type: 'integer' })
  @ApiQuery({ name: 'numDays', type: 'integer' })
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
  public async getHistoricalData(
    @Query('topicId', new ParseIntPipe()) topicId: number,
    @Query('numDays', new ParseIntPipe()) numDays: number,
  ): Promise<MqttMessage[]> {
    try {
      return await this.historicalDataService.getHistoricalDataForClient(
        topicId,
        numDays,
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('messages')
  @ApiOperation({
    description: 'HEAD servicer for historical data endpoint (legacy support)',
  })
  @ApiQuery({ name: 'topicId', type: 'integer' })
  @ApiQuery({ name: 'numDays', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getHistoricalDataHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('topicId', new ParseIntPipe()) topicId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('numDays', new ParseIntPipe()) numDays: number,
  ): void {
    Utils.sendOkHeaders(res);
  }
}
