import { Module } from '@nestjs/common';

import { YoomoneyService } from './yoomoney.service.js';

@Module({
  providers: [YoomoneyService],
})
export class YoomoneyModule {}
