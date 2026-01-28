import { Injectable, NotFoundException } from '@nestjs/common';

import { BillingPeriod, User } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

import { InitPaymentRequest } from './dto/init.dto.js';

@Injectable()
export class PaymentService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getHistory(user: User) {
    const payments = await this.prismaService.transaction.findMany({
      where: {
        id: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    const formatted = payments.map(payment => ({
      id: payment.id,
      createdAt: payment.createdAt,
      plan: payment.subscription.plan.title,
      amount: payment.amount,
      provider: payment.provider,
      status: payment.status,
    }));

    return formatted;
  }

  public async init(dto: InitPaymentRequest, user: User) {
    const { planId, billingPeriod, provider } = dto;

    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!plan) {
      throw new NotFoundException('not found plan');
    }

    const amount =
      billingPeriod === BillingPeriod.YEARLY
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const transaction = await this.prismaService.transaction.create({
      data: {
        amount: amount,
        provider,
        billingPeriod,
        user: {
          connect: {
            id: user.id,
          },
        },
        subscription: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            plan: {
              connect: {
                id: plan.id,
              },
            },
          },
        },
      },
    });

    return transaction;
  }
}
