import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  @ApiProperty({
    example: 'password123',
    description: 'Password for the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
