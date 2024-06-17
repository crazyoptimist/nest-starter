import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 5,
    maxLength: 72,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(72)
  password: string;
}
