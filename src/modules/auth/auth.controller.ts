import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guard/jwt-auth.guard';
import { Roles } from './../../common/decorators/roles.decorator';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { RolesGuard } from './guard/roles-auth.guard';
import { RegisterUserDto } from '../user/dtos/register.dto';
import { GoogleRedirectDto } from './dtos/googleRedirect-auth.dto';
import { RegisterAdminDto } from './../user/dtos/register.dto';
import { RegisterManagerDto } from './../user/dtos/register.dto';
import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Credential } from './interfaces/credential.interface';
import { AccountInfo } from '../user/interfaces/AccountInfo.interface';

@Controller('auths')
@ApiTags('Auths')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginAuthDto): Promise<Credential> {
    const { email, password } = plainToClass(LoginAuthDto, dto, {
      excludeExtraneousValues: true,
    });
    return await this.authService.credentialByPassword(email, password);
  }

  @Post('google-login')
  async loginWithGoogle(@Body() dto: GoogleRedirectDto): Promise<Credential> {
    const data = plainToClass(GoogleRedirectDto, dto, {
      excludeExtraneousValues: true,
    });
    return await this.authService.credentialWithoutPassword(data);
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<AccountInfo> {
    const user = plainToClass(RegisterUserDto, dto, {
      excludeExtraneousValues: true,
    });
    return this.authService.register(user, null);
  }

  @Post('manager-create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async registerManager(
    @Body() dto: RegisterManagerDto,
    @Request() req: any,
  ): Promise<AccountInfo> {
    const manager = plainToClass(RegisterManagerDto, dto, {
      excludeExtraneousValues: true,
    });
    return await this.authService.register(manager, req.user);
  }

  @Post('admin-create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async registerAdmin(
    @Body() dto: RegisterAdminDto,
    @Request() req: any,
  ): Promise<AccountInfo> {
    const admin = plainToClass(RegisterAdminDto, dto, {
      excludeExtraneousValues: true,
    });
    return await this.authService.register(admin, req.user);
  }
}
