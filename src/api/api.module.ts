import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { PaymentModule } from './payment/payment.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [AuthModule, UsersModule, PaymentModule],
})
export class ApiModule {}
