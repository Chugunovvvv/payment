import { Controller, Get } from '@nestjs/common';

import type { User } from '../../../generated/prisma/client.js';
import { Authorized } from '../../common/decorators/authorized.decorator.js';
import { Protected } from '../../common/decorators/protected.decorator.js';

import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protected()
  @Get('me')
  public getMe(@Authorized() user: User) {
    return user;
  }
}
