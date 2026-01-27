import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../infra/prisma/prisma.service.js';

@Injectable()
export class PlanService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getAllPlans() {
    const plans = await this.prismaService.plan.findMany({
      orderBy: {
        monthlyPrice: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        monthlyPrice: true,
        yearlyPrice: true,
        features: true,
        isFeatured: true,
      },
    });
    return plans;
  }

  public async getPlanById(planId: string) {
    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: planId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        monthlyPrice: true,
        yearlyPrice: true,
        features: true,
        isFeatured: true,
      },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }
}
