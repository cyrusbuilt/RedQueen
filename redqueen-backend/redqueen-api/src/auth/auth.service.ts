import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from '@redqueen-backend/redqueen-data/dist/user/entity/user.entity';
import { UsersService } from '@redqueen-backend/redqueen-data/dist/user/user.service';
import { Logger } from 'winston';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtSigningPayloadDto } from './dto/vaidation.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRoles } from 'src/helper_types';
import Configuration from 'src/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async validateUser(
    email: string,
    hashedPassword: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.passwordHash) {
      const isPasswordMatch = await bcrypt.compare(
        hashedPassword,
        user.passwordHash,
      );

      if (isPasswordMatch) {
        return user;
      }
    }

    return null;
  }

  public async login(user: LoginRequestDto): Promise<LoginResponseDto> {
    const response: LoginResponseDto = {
      token: null,
      userId: null,
      success: false,
      expiration: null,
    };

    const validatedUser = await this.validateUser(user.email, user.password);
    if (validatedUser) {
      if (validatedUser.lockoutEnabled) {
        throw new Error('User locked out.');
      }

      const payload: JwtSigningPayloadDto = {
        username: validatedUser.email,
        sub: validatedUser.id,
      };

      const exp = new Date();
      exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000);

      response.token = this.jwtService.sign(payload);
      response.success = true;
      response.userId = validatedUser.id;
      response.expiration = exp;

      try {
        await this.usersService.logAccess(validatedUser.id);
      } catch (e: any) {
        this.logger.error('Log user access failed!', e);
      }
    }

    return response;
  }

  public async register(user: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    createdUser.passwordHash = null;
    return createdUser;
  }

  public async promoteToAdmin(user: User): Promise<void> {
    user.role = UserRoles.ADMIN;
    await this.usersService.saveUser(user);
  }

  public async resetPassword(
    userId: string,
    token: string,
    newPassword: string,
  ): Promise<LoginResponseDto> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error(`User not found for ID: ${userId}`);
    }

    const result = await this.jwtService.verifyAsync(token, {
      secret: Configuration.shared.jwtSecret,
    });

    // TODO remove this after debug
    console.log('result', result);

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    const updateResult = await this.usersService.saveUser(user);
    if (updateResult) {
      const loginRequest = new LoginRequestDto();
      loginRequest.email = user.email;
      loginRequest.password = newPassword;

      const loginResult = await this.login(loginRequest);
      return loginResult;
    }

    throw new Error(`Unable to update user with ID: ${userId}`);
  }

  public async setLockoutEnabled(
    user: User,
    enabled: boolean,
  ): Promise<boolean> {
    user.lockoutEnabled = enabled;
    user.modifiedAt = new Date();
    try {
      await this.usersService.saveUser(user);
      return true;
    } catch (e: any) {
      this.logger.error(`Failed to enable lockout for user: ${user.id}`, e);
      return false;
    }
  }

  public async updateUserRegistration(registration: User): Promise<boolean> {
    const user = await this.usersService.findOneById(registration.id);
    if (!user) {
      this.logger.error('updateUserRegistration: User does not exist!');
      return false;
    }

    try {
      user.email = registration.email;
      user.firstName = registration.firstName;
      user.lastName = registration.lastName;
      await this.usersService.saveUser(user);
      return true;
    } catch (e: any) {
      this.logger.error('updateUserRegistration: Failed to update user.', e);
    }

    return false;
  }
}
