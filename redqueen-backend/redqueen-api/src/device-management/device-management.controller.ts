import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Head,
  HttpStatus,
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
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Device,
  DeviceDto,
  PaginatedDevices,
  RedqueenService,
} from '@redqueen-backend/redqueen-data';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import DeviceClass from 'src/common/device-class';
import { GeneralResponseDto } from 'src/common/models/general-response.dto';
import Utils from 'src/common/utils';
import { ErrorResponseDto } from 'src/model/error-response-dto';

@ApiTags('device')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/device')
export class DeviceManagementController {
  constructor(private readonly redQueenDataService: RedqueenService) {}

  @Get('list')
  @ApiOperation({ description: 'Gets a list of all known devices' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [Device],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getDevices(): Promise<Device[]> {
    try {
      return await this.redQueenDataService.getDevices(false);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('list')
  @ApiOperation({
    description: 'HEAD servicer for list devices endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getDevicesHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Get('list/paginated')
  @ApiOperation({ description: 'Gets a paged list of all known devices' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: PaginatedDevices,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getDevicesPaginated(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): Promise<PaginatedDevices> {
    try {
      return await this.redQueenDataService.getDevicesPaged(
        pageSize,
        currentPage,
        false,
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('list/paginated')
  @ApiOperation({
    description:
      'HEAD servicer for get paginated device list endpoint (legacy support)',
  })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getDevicesPaginatedHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Put(':id')
  @ApiOperation({ description: 'Updates an existing device' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: DeviceDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Device,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching device not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateDevice(
    @Param('id') id: number,
    @Body() device: DeviceDto,
  ): Promise<Device> {
    try {
      const result = await this.redQueenDataService.updateDevice(id, device);
      if (!result) {
        const err = new GeneralResponseDto(
          'Error',
          'Matching device not found',
        );
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('legacy/:id')
  @ApiOperation({ description: 'Updates an existing device (legacy support)' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: DeviceDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Device,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching device not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateDeviceLegacy(
    @Param('id') id: number,
    @Body() device: DeviceDto,
  ): Promise<Device> {
    return await this.updateDevice(id, device);
  }

  @Head('legacy/:id')
  @ApiOperation({
    description: 'HEAD servicer for device update endpoint (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBody({ type: DeviceDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public updateDeviceLegacyHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() device: DeviceDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Post('add')
  @ApiOperation({ description: 'Adds a new device' })
  @ApiBody({ type: DeviceDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Device,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async addDevice(@Body() device: DeviceDto): Promise<Device> {
    try {
      const result = await this.redQueenDataService.addDevice(device);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Device already exists');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('add')
  @ApiOperation({
    description: 'HEAD servicer for add device endpoint (legacy support)',
  })
  @ApiBody({ type: DeviceDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public addDeviceHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() device: DeviceDto,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('classes')
  @ApiOperation({ description: 'Gets a list of compatible device classes' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Array<string>,
  })
  public async getDeviceClasses(): Promise<string[]> {
    return DeviceClass.ALL;
  }

  @Head('classes')
  @ApiOperation({
    description:
      'HEAD servicer for get device classes endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getDeviceClassesHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }
}
