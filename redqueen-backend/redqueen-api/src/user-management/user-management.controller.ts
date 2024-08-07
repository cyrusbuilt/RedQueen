import {
  BadRequestException,
  Controller,
  Get,
  Head,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedLoginHistoryDto,
  User,
  UsersService,
} from '@redqueen-backend/redqueen-data';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GeneralResponseDto } from 'src/common/models/general-response.dto';
import Utils from 'src/common/utils';
import { ErrorResponseDto } from 'src/model/error-response-dto';

@UseGuards(JwtAuthGuard)
@ApiTags('user')
@ApiBearerAuth()
@Controller('api/user')
export class UserManagementController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ description: 'Gets a user by ID' })
  @ApiQuery({ name: 'userId', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'User not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getUser(@Query('userId') userId: string): Promise<User> {
    try {
      const result = await this.userService.findOneById(userId);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'User not found');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head()
  @ApiOperation({
    description: 'HEAD servicer for get user endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getUserHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('userId') userId: string,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('list')
  @ApiOperation({ description: 'Gets a list of all known users' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [User],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Success',
    type: ErrorResponseDto,
  })
  public async getUserList(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('list')
  @ApiOperation({
    description: 'HEAD servicer for get users list endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [User],
  })
  public getUserListHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Get(':id/login-history')
  @ApiOperation({
    description: 'Gets a paged list of user login records by user ID',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: PaginatedLoginHistoryDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getLoginHistory(
    @Param('id') id: string,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): Promise<PaginatedLoginHistoryDto> {
    try {
      return await this.userService.getLoginHistory(id, pageSize, currentPage);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id/login-history')
  @ApiOperation({
    description:
      'HEAD servicer for get user login history endpoint (legacy support)',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getLoginHistoryHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): void {
    Utils.sendOkHeaders(res);
  }
}
