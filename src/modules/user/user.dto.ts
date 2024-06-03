import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsEnum, ValidateIf } from 'class-validator';
import { RoleEnum } from './role.entity';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @Allow()
  firstName: string;

  @ApiPropertyOptional()
  @Allow()
  lastName: string;

  @ApiPropertyOptional({
    enum: RoleEnum,
    isArray: true,
    default: [RoleEnum.User],
  })
  @ValidateIf((obj: UpdateUserDto) => obj.roles && obj.roles.length != 0)
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
