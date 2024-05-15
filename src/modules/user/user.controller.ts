import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { IUser } from './user.interface';
import { UpdateUserDto } from './user.dto';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'New User Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() signupDto: SignupDto): Promise<IUser> {
    return this.userService.create(signupDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'All Users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<Array<IUser>> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User For Given ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<IUser> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Successful Delete' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden Resource' })
  async delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(+id);
  }
}
