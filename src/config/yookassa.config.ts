import { ConfigService } from '@nestjs/config';
import type { YookassaModuleOptions } from 'nestjs-yookassa';

export function getYookassaConfig(
  configService: ConfigService,
): YookassaModuleOptions {
  return {
    shopId: configService.getOrThrow<string>('YOOKASSA_SHOPID'),
    apiKey: configService.getOrThrow<string>('YOOKASSA_SECRET_KEY'),
  };
}
