import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Payment API')
    .setVersion(process.env.npm_package_version || '1.0')
    .build();
}
