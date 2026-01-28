import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { YoomoneyModule } from './providers/yoomoney/yoomoney.module.js';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [YoomoneyModule],
})
export class PaymentModule {}
