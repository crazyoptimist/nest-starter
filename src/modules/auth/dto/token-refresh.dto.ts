import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenRefreshDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  refreshToken: string;
}
