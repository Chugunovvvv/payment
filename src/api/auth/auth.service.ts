import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import ms, { StringValue } from 'ms';

import { User } from '../../../generated/prisma-client/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

import { RegisterDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_EXPIRES_IN: StringValue;
  private readonly JWT_REFRESH_TOKEN_EXPIRES_IN: StringValue;
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
  }

  public async register(dto: RegisterDto) {
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

    return this.generateTokens(user);
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
}
