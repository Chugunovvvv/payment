import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { User } from '../../../generated/prisma/client.js';
import { Authorized } from '../../common/decorators/authorized.decorator.js';
import { Protected } from '../../common/decorators/protected.decorator.js';

import { InitPaymentRequest } from './dto/init.dto.js';
import { PaymentHistoryResponse } from './dto/payment.history.dto.js';
import { PaymentService } from './payment.service.js';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Get payment history',
    description: 'Returns the list of all users transactions',
  })
  @ApiOkResponse({
    type: [PaymentHistoryResponse],
  })
  @Protected()
  @Get()
  public async getHistory(@Authorized() user: User) {
    return await this.paymentService.getHistory(user);
  }
  @Protected()
  @Post()
  public async init(@Body() dto: InitPaymentRequest, @Authorized() user: User) {
    return await this.paymentService.init(dto, user);
  }
}
