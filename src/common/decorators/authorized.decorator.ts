import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import type { User } from '../../../generated/prisma/client.js';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return data ? user?.[data] : user;
  },
);
