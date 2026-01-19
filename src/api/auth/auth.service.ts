import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/prisma/prisma.service';

import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }
}
