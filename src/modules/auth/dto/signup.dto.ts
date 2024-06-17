import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SameAs } from '@modules/common/validator/same-as.validator';

export class SignupDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
    minLength: 5,
    maxLength: 72,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(72)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
