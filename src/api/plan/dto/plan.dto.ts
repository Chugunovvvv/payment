import { ApiProperty } from '@nestjs/swagger';

export class PlanResponse {
  @ApiProperty({
    description: 'The unique identifier of the plan',
    example: '25nrbBvRk745g6t3',
  })
  public id: string;

  @ApiProperty({
    description: 'The title of the plan',
    example: 'Premium Plan',
  })
  public title: string;

  @ApiProperty({
    description: 'The description of the plan',
    example: 'This is a premium plan',
  })
  public description: string;

  @ApiProperty({ description: 'The monthly price of the plan', example: 10 })
  public monthlyPrice: number;

  @ApiProperty({ description: 'The yearly price of the plan', example: 100 })
  public yearlyPrice: number;

  @ApiProperty({
    description: 'The features included in the plan',
    example: ['Unlimited projects', 'Priority Support', 'Advanced analytics'],
    isArray: true,
  })
  public features: string[];

  @ApiProperty({
    description: 'Indicates if the plan is featured',
    example: true,
  })
  public isFeatured?: boolean;
}
