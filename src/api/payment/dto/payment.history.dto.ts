import { ApiProperty } from '@nestjs/swagger';

import {
  PaymentProvider,
  TransactionStatus,
} from '../../../../generated/prisma/enums.js';

export class PaymentHistoryResponse {
  @ApiProperty({
    description: 'unique transaction identifier',
    example: '-ha2Lv222XZOk5NGQnZyA',
  })
  public id: string;
  @ApiProperty({
    description: 'created at',
  })
  public createdAt: Date;
  @ApiProperty({
    description: 'plan of the transaction',
    example: 'Premium',
  })
  public plan: string;
  @ApiProperty({
    description: 'amount of the plan subscription',
    example: 4000,
  })
  public amount: number;
  @ApiProperty({
    description: 'provider of the transaction',
    example: PaymentProvider,
  })
  public provider: PaymentProvider;
  @ApiProperty({
    description: 'status of the transaction',
    example: TransactionStatus,
  })
  public status: TransactionStatus;
}
