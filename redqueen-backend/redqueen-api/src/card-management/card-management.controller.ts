import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Head,
  HttpStatus,
  Inject,
  InternalServerErrorException,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AccessControlUser,
  Card,
  CardService,
  PaginatedAccessControlUsers,
  PaginatedCards,
} from '@redqueen-backend/redqueen-data';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GeneralResponseDto } from 'src/common/models/general-response.dto';
import Utils from 'src/common/utils';
import { Logger } from 'winston';
import { ErrorResponseDto } from 'src/model/error-response-dto';

@ApiTags('card')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/card')
export class CardManagementController {
  constructor(
    private readonly cardService: CardService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('list')
  @ApiOperation({ description: 'Gets a paged list of cards' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: PaginatedCards,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getCards(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): Promise<PaginatedCards> {
    try {
      return await this.cardService.getCards(pageSize, currentPage);
    } catch (e: any) {
      this.logger.error('Failed to retrieve cards: ', e);
      throw new InternalServerErrorException(e);
    }
  }

  @Head('list')
  @ApiOperation({
    description: 'HEAD servicer for get cards endpoint (legacy support)',
  })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getCardsHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('active-users')
  @ApiOperation({ description: 'Gets a list of active card users' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: [AccessControlUser],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getActiveUsers(): Promise<AccessControlUser[]> {
    try {
      return await this.cardService.getActiveUsers();
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('active-users')
  @ApiOperation({
    description: 'HEAD servicer for get active users endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getActiveUsersHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('update')
  @ApiOperation({ description: 'Updates the specified card' })
  @ApiBody({ type: Card })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Card,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching card to update not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateCard(@Body() card: Partial<Card>): Promise<Card> {
    try {
      const result = await this.cardService.updateCard(card);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Matching card not found.');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('legacy/update')
  @ApiOperation({ description: 'Updates the specified card (legacy support)' })
  @ApiBody({ type: Card })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Card,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Matching card to update not found',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateCardLegacy(@Body() card: Partial<Card>): Promise<Card> {
    return await this.updateCard(card);
  }

  @Head('legacy/update')
  @ApiOperation({
    description: 'HEAD servicer for update card endpoint (legacy support)',
  })
  @ApiBody({ type: Card })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public updateCardLegacyHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() card: Partial<Card>,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Post('add')
  @ApiOperation({ description: 'Adding a new access control card' })
  @ApiBody({ type: Card })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: Card,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Card already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async addCard(@Body() card: Partial<Card>): Promise<Card> {
    try {
      const result = await this.cardService.addCard(card);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Card already exists.');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('add')
  @ApiOperation({
    description: 'HEAD servicer for add card endpoint (legacy support)',
  })
  @ApiBody({ type: Card })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public addCardHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() card: Partial<Card>,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Get('all-users')
  @ApiOperation({ description: 'Gets ALL access control users' })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: PaginatedAccessControlUsers,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async getAllCardUsers(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): Promise<PaginatedAccessControlUsers> {
    try {
      return await this.cardService.getCardUsers(pageSize, currentPage);
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('all-users')
  @ApiOperation({
    description:
      'HEAD servicer for get all card users endpoint (legacy support)',
  })
  @ApiQuery({ name: 'pageSize', type: 'integer' })
  @ApiQuery({ name: 'currentPage', type: 'integer' })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public getAllCardUsersHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('currentPage', new ParseIntPipe()) currentPage: number,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Put('user')
  @ApiOperation({ description: 'Updates an existing card user' })
  @ApiBody({ type: AccessControlUser })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: AccessControlUser,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Card user does not exist',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateCardUser(
    @Body() user: Partial<AccessControlUser>,
  ): Promise<AccessControlUser> {
    try {
      const result = await this.cardService.updateCardUser(user);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Card user does not exist');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('legacy/user')
  @ApiOperation({
    description: 'Updates an existing card user (legacy support)',
  })
  @ApiBody({ type: AccessControlUser })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: AccessControlUser,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Card user does not exist',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async updateCardUserLegacy(
    @Body() user: Partial<AccessControlUser>,
  ): Promise<AccessControlUser> {
    return await this.updateCardUser(user);
  }

  @Head('legacy/user')
  @ApiOperation({
    description: 'Updates an existing card user (legacy support)',
  })
  @ApiBody({ type: AccessControlUser })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public updateCardUserLegacyHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() user: Partial<AccessControlUser>,
  ): void {
    Utils.sendOkHeaders(res);
  }

  @Post('add-user')
  @ApiOperation({ description: 'Adds a new card user' })
  @ApiBody({ type: AccessControlUser })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
    type: AccessControlUser,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Card user already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Error',
    type: ErrorResponseDto,
  })
  public async addCardUser(
    @Body() user: Partial<AccessControlUser>,
  ): Promise<AccessControlUser> {
    try {
      const result = await this.cardService.addCardUser(user);
      if (!result) {
        const err = new GeneralResponseDto('Error', 'Card user already exists');
        throw new BadRequestException(err);
      }

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  @Head('add-user')
  @ApiOperation({
    description: 'HEAD servicer for add card user endpoint (legacy support)',
  })
  @ApiBody({ type: AccessControlUser })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Success',
  })
  public addCardUserHead(
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() user: Partial<AccessControlUser>,
  ): void {
    Utils.sendOkHeaders(res);
  }
}
