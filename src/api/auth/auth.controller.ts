import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto';
import { AuthResponse } from './dto/auth.dto';

@ApiTags('Authentication')
@ApiOkResponse({ description: 'Successful operation', type: AuthResponse })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiConflictResponse({ description: 'Conflict' })
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers user and sets httpOnly cookies',
  })
  @Post('register')
  public async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return this.authService.register(res, dto);
  }
  @ApiOperation({
    summary: 'Login and existing user',
    description: 'Logs in user and sets httpOnly cookies',
  })
  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return this.authService.login(res, dto);
  }
  @ApiOperation({
    summary: 'Logout user',
    description: 'Clears authentication cookies',
  })
  @Post('logout')
  public logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
  @ApiOperation({
    summary: 'Refresh access tokens',
    description: 'Refreshes access and refresh tokens',
  })
  @Post('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(req, res);
  }
}
