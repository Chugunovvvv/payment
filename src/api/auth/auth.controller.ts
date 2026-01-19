import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
