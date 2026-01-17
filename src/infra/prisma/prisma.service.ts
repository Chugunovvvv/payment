import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '../../../generated/prisma-client/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  public async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma Client connected');
    } catch (error) {
      this.logger.error('Error connecting Prisma Client', error);
      throw error;
    }
  }

  public async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Prisma Client disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Prisma Client', error);
      throw error;
    }
  }
}
