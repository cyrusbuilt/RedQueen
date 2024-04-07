import {
  Controller,
  Head,
  HttpStatus,
  Inject,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request, Response } from 'express';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { GeneralResponseDto } from 'src/common/models/general-response.dto';
import Utils from 'src/common/utils';
import {
  DatabaseErrorCode,
  RegisterDto,
  User,
} from '@redqueen-backend/redqueen-data';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticates a user' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'The login result',
    type: LoginResponseDto,
  })
  public async login(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for login');
      const errResp = new GeneralResponseDto(
        'Error',
        'No request body for login',
      );
      res.status(HttpStatus.BAD_REQUEST).json(errResp);
      return;
    }

    const creds = request.body as LoginRequestDto;
    try {
      const result: LoginResponseDto = await this.authService.login(creds);
      res
        .status(result.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
        .json(result);
    } catch (e: any) {
      const err = e as Error;
      const errResult = new GeneralResponseDto('Error', err.message);
      res.status(HttpStatus.BAD_REQUEST).json(errResult);
    }
  }

  @Head('login')
  @ApiOperation({
    summary: 'HEAD servicer for login endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public loginHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registers a new use' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'User registration succeeded',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'A user with the same email already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Unexpected error while creating the user.',
  })
  public async register(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request bod provided for user registration');
      const err = new GeneralResponseDto('Error', 'No request body provided');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const reg = request.body as RegisterDto;
    try {
      await this.authService.register(reg);
      const result = new GeneralResponseDto(
        'Success',
        'User created successfully',
      );
      res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      if (e?.code === DatabaseErrorCode.UniqueViolation) {
        this.logger.error(`User already exists for email: ${reg.email}`);
        const err = new GeneralResponseDto(
          'Error',
          'Another user with that email address already exists.',
        );
        res.status(HttpStatus.BAD_REQUEST).json(err);
      } else {
        this.logger.error(e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    }
  }

  @Head('register')
  @ApiOperation({
    summary: 'HEAD servicer for registration endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public registerHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registers a new admin user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Admin registration succeeded',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'An admin with the same email already exists',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Unexpected error while creating the admin.',
  })
  public async registerAdmin(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for admin registration.');
      const err = new GeneralResponseDto('Error', 'No request body provided.');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const reg = request.body as RegisterDto;
    try {
      const user = await this.authService.register(reg);
      await this.authService.promoteToAdmin(user);
      const result = new GeneralResponseDto(
        'Success',
        'Admin user created successfully.',
      );
      res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      if (e?.code === DatabaseErrorCode.UniqueViolation) {
        this.logger.error(`Admin already exists for email: ${reg.email}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Another admin with that email address already exists.',
        });
      } else {
        this.logger.error(e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    }
  }

  @Head('register-admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'HEAD servicer for admin registration endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public registerAdminHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('password-reset')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Resets a user's password" })
  @ApiBody({ type: PasswordResetRequestDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Password reset successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Failed to reset password',
    type: GeneralResponseDto,
  })
  public async resetPassword(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for password reset.');
      const err = new GeneralResponseDto('Error', 'No request body provided.');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const resetReq = request.body as PasswordResetRequestDto;
    try {
      const result = await this.authService.resetPassword(
        resetReq.userId,
        resetReq.token,
        resetReq.newPassword,
      );
      res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      this.logger.error(e);
      res.status(HttpStatus.BAD_REQUEST);
    }
  }

  @Post('legacy/password-reset')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Resets a user's password (legacy client support)" })
  @ApiBody({ type: PasswordResetRequestDto })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Password reset successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'Failed to reset password',
  })
  public async legacyResetPassword(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    return await this.resetPassword(request, res);
  }

  @Head('legacy/password-reset')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'HEAD servicer for legacy password reset endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public legacyResetPasswordHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Disables a user's account" })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account lockout successful',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'No request body or account lockout failed',
    type: GeneralResponseDto,
  })
  public async enableLockout(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for lockout.');
      const err = new GeneralResponseDto('Error', 'No request body provided.');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const lockoutReq = request.body as User;
    const lockoutRes = await this.authService.setLockoutEnabled(
      lockoutReq,
      true,
    );
    const result: GeneralResponseDto = {
      status: 'Error',
      message: 'Account lockout failed. See log for details.',
    };
    if (lockoutRes) {
      result.status = 'Success';
      result.message = 'Account locked out';
      res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('legacy/disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Disables a user's account (legacy support)." })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account lockout successful',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'No request body or account lockout failed',
    type: GeneralResponseDto,
  })
  public async legacyEnableLockout(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    return await this.enableLockout(request, res);
  }

  @Head('legacy/disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'HEAD servicer for legacy lockout enable endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public legacyEnableLockoutHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('enable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Enables a user's account" })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account unlock successful',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'No request body or account unlock failed',
    type: GeneralResponseDto,
  })
  public async disableLockout(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for lockout disable.');
      const err = new GeneralResponseDto('Error', 'No request body provided.');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const unlockReq = request.body as User;
    const lockoutRes = await this.authService.setLockoutEnabled(
      unlockReq,
      false,
    );
    const result: GeneralResponseDto = {
      status: 'Error',
      message: 'Account unlock failed. See log for details.',
    };
    if (lockoutRes) {
      result.status = 'Success';
      result.message = 'Account unlocked';
      res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('legacy/enable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Enables a user's account (legacy client support)" })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account unlock successful',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST as number,
    description: 'No request body or account unlock failed',
    type: GeneralResponseDto,
  })
  public async legacyDisableLockout(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    return await this.disableLockout(request, res);
  }

  @Head('legacy/enable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'HEAD servicer for legacy account enablement endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public legacyDisableLockoutHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Updates a user's account registration" })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account update success',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Account update failed',
    type: GeneralResponseDto,
  })
  public async updateRegistration(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.body) {
      this.logger.error('No request body provided for registration update.');
      const err = new GeneralResponseDto('Error', 'No request body provided.');
      res.status(HttpStatus.BAD_REQUEST).json(err);
      return;
    }

    const regResponse: GeneralResponseDto = {
      status: 'Success',
      message: 'Account registration updated.',
    };

    const reqBody = request.body as User;
    const result = await this.authService.updateUserRegistration(reqBody);
    if (result) {
      res.status(HttpStatus.OK).json(regResponse);
    } else {
      regResponse.status = 'Error';
      regResponse.message =
        'Account registration update failed. See log for details.';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(regResponse);
    }
  }

  @Post('legacy/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Updates a user's account registration (legacy client support)",
  })
  @ApiBody({ type: User })
  @ApiResponse({
    status: HttpStatus.OK as number,
    description: 'Account update success',
    type: GeneralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR as number,
    description: 'Account update failed',
    type: GeneralResponseDto,
  })
  public async legacyUpdateRegistration(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    return await this.updateRegistration(request, res);
  }

  @Head('legacy/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'HEAD servicer for user account registration update endpoint (legacy support)',
  })
  @ApiResponse({
    status: HttpStatus.OK as number,
  })
  public legacyUpdateRegistrationHead(@Res() res: Response): void {
    Utils.sendOkHeaders(res);
  }
}
