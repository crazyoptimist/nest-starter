import { Controller, Body, Post, Get, Request } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '@modules/user/user.service';
import { IRequest } from '@modules/user/user.interface';
import { NoAuth } from '@modules/common/decorator/no-auth.decorator';
import { TokenRefreshDto } from './dto/token-refresh.dto';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @NoAuth()
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() dto: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(dto);
    return this.authService.createTokenPair(user);
  }

  @Post('signup')
  @NoAuth()
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    const user = await this.userService.create(signupDto);
    return this.authService.createTokenPair(user);
  }

  @Post('refresh')
  @NoAuth()
  @ApiResponse({ status: 201, description: 'Successful Token Refresh' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Body() dto: TokenRefreshDto): Promise<any> {
    const user = await this.authService.validateRefreshToken(dto);
    return this.authService.createTokenPair(user);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Successful Logout' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() request: IRequest): Promise<any> {
    return await this.userService.deleteRefreshToken(request.user?.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request: IRequest): Promise<any> {
    return this.userService.findOne(request.user?.id);
  }
}
