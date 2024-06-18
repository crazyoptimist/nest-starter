import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Patch,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { IUser } from './user.interface';
import { UpdateUserDto } from './user.dto';
import {
  getFilterParams,
  getPaginationParam,
  getSortParams,
} from '@app/utils/query-param.util';
import { TOTAL_COUNT_HEADER_KEY } from '@app/constants';
import { PoliciesGuard } from '../infrastructure/casl/policies.guard';
import { CheckPolicies } from '../infrastructure/casl/check-policies.decorator';
import { Action } from '../infrastructure/casl/action.enum';
import { User } from './user.entity';

@Controller('api/users')
@UseGuards(PoliciesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  @ApiResponse({ status: 201, description: 'New User Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() signupDto: SignupDto): Promise<IUser> {
    return this.userService.create(signupDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, User))
  @ApiResponse({ status: 200, description: 'All Users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() query: Object,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Array<IUser>> {
    const paginationParam = getPaginationParam(query);
    const sortParams = getSortParams(query);
    const filterParams = getFilterParams(query);

    const { users, totalCount } = await this.userService.findAll(
      paginationParam,
      sortParams,
      filterParams,
    );

    res.set(TOTAL_COUNT_HEADER_KEY, totalCount.toString());

    return users;
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, User))
  @ApiResponse({ status: 200, description: 'User For Given ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<IUser> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, User))
  @ApiResponse({ status: 200, description: 'Successful Update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden Resource' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, User))
  @ApiResponse({ status: 200, description: 'Successful Delete' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden Resource' })
  async delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(+id);
  }
}
