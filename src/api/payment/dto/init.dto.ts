import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import {
  BillingPeriod,
  PaymentProvider,
} from '../../../../generated/prisma/enums.js';

export class InitPaymentRequest {
  @IsString()
  @IsNotEmpty()
  public planId: string;

  @IsEnum(BillingPeriod)
  public billingPeriod: BillingPeriod;

  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}
