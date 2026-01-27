import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PlanResponse } from './dto/plan.dto.js';
import { PlanService } from './plan.service.js';

@Controller('plans')
export class PlanController {
  public constructor(private readonly planService: PlanService) {}
  @ApiOperation({
    summary: 'Get all subscriptions plans',
    description: 'Retrieve a list of all available subscription plans.',
  })
  @ApiOkResponse({ type: [PlanResponse] })
  @Get()
  public async getAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.planService.getAllPlans();
  }

  @ApiOperation({
    summary: 'Get subscription plan by ID',
    description: 'Retrieve details of a specific subscription plan by its ID.',
  })
  @ApiOkResponse({ type: PlanResponse })
  @Get(':id')
  public async getById(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.planService.getPlanById(id);
  }
}
