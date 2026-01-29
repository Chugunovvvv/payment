import { Injectable } from '@nestjs/common';
import {
  ConfirmationEnum,
  CurrencyEnum,
  PaymentMethodsEnum,
  YookassaService,
} from 'nestjs-yookassa';

import {
  BillingPeriod,
  Plan,
  Transaction,
} from '../../../../../generated/prisma/client.js';

@Injectable()
export class YoomoneyService {
  public constructor(private readonly yookassaService: YookassaService) {}

  public async create(
    plan: Plan,
    transaction: Transaction,
    billingPeriod: BillingPeriod,
  ) {
    const amount =
      billingPeriod === BillingPeriod.MONTHLY
        ? plan.monthlyPrice
        : plan.yearlyPrice;

    const payment = await this.yookassaService.payments.create({
      amount: {
        value: amount,
        currency: CurrencyEnum.RUB,
      },
      description: `Оплата подписки ${plan.title}`,
      payment_method_data: {
        type: PaymentMethodsEnum.BANK_CARD,
      },
      confirmation: {
        type: ConfirmationEnum.REDIRECT,
        return_url: 'https://google.com',
      },
      save_payment_method: true,
    });

    return payment;
  }
}
