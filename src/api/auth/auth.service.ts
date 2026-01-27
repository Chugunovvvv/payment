import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import ms, { StringValue } from 'ms';

import { User } from '../../../generated/prisma/client.js';
import { isDev } from '../../common/utils/is-dev.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

import { LoginRequest } from './dto/login.dto.js';
import { RegisterRequest } from './dto/register.dto.js';
import { JwtPayload } from './interfaces/jwt.interface.js';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_EXPIRES_IN: StringValue;
  private readonly JWT_REFRESH_TOKEN_EXPIRES_IN: StringValue;

  private readonly COOKIE_DOMAIN: string;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_EXPIRES_IN =
      this.configService.getOrThrow<StringValue>('JWT_TOKEN_EXPIRES_IN');
    this.JWT_REFRESH_TOKEN_EXPIRES_IN =
      this.configService.getOrThrow<StringValue>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      );
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  public async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await hash(password);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return this.auth(res, user);
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = { id: user.id };

    const refreshTokenExpiresInMs = new Date(
      Date.now() + ms(this.JWT_REFRESH_TOKEN_EXPIRES_IN),
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accessToken, refreshToken, refreshTokenExpiresInMs };
  }

  public async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new NotFoundException('Invalid credentials');
    }

    const isValidPassword = await verify(existingUser.password, password);

    if (!isValidPassword) {
      throw new NotFoundException('Invalid credentials');
    }

    return this.auth(res, existingUser);
  }

  public logout(res: Response) {
    return this.setCookie(res, '', new Date(0));
  }

  private async auth(res: Response, user: User) {
    const { accessToken, refreshToken, refreshTokenExpiresInMs } =
      await this.generateTokens(user);

    this.setCookie(res, refreshToken, refreshTokenExpiresInMs);
    return { accessToken };
  }

  public async refreshTokens(req: Request, res: Response) {
    if (!req.cookies || !req) {
      throw new UnauthorizedException('No refresh token found');
    }
    const refreshToken: string = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.auth(res, user);
    }
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: 'lax',
    });
  }
}
