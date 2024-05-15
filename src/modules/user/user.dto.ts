import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @Allow()
  firstName: string;

  @ApiPropertyOptional()
  @Allow()
  lastName: string;
}
