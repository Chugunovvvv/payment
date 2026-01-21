import { Controller, Get } from '@nestjs/common';

import type { User } from '../../../generated/prisma-client/browser';
import { Authorized } from '../../common/decorators/authorized.decorator';
import { Protected } from '../../common/decorators/protected.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protected()
  @Get('me')
  public getMe(@Authorized() user: User) {
    return user;
  }
}
