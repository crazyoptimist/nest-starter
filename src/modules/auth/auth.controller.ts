import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@modules/auth/auth.service';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { UsersService } from '@modules/user/user.service';
import { IRequest } from '@modules/user/user.interface';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  private readonly lambdaClient: LambdaClient;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {

    this.lambdaClient = new LambdaClient({
      region: 'us-east-2',
    });
  }

  private async invokeCreateUserLambda(data: any): Promise<any> {
    const payload = new TextEncoder().encode(JSON.stringify(data));
    const command = new InvokeCommand({
      FunctionName: 'UserManagementStack-CreateUserLambda0154A2EB-5ufMqT4E5ntw',
      Payload: payload,
    });
    const response = await this.lambdaClient.send(command);
    console.log('response', response)
    // Decode the Uint8Array payload response from Lambda back to string
    const lambdaResponseString = new TextDecoder().decode(response.Payload as Uint8Array);
    const lambdaResponse = JSON.parse(lambdaResponseString);
    return lambdaResponse;
  }

  @Post('signin')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signin(@Body() signinDto: SigninDto): Promise<any> {
    const user = await this.authService.validateUser(signinDto);
    return await this.authService.createToken(user);
  }

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    const existingUser = await this.userService.getByEmail(signupDto.email);
    const existingUserByPhone = await this.userService.getByPhone(signupDto.phone);

    // If user's email exists in the database, throw an error
    if (existingUser) {
      throw new Error('Email already exists in the system.');
    }

    // If user's phone exists in the database, throw an error
    if (existingUserByPhone) {
      throw new Error('Phone already exists in the system.');
    }

    // if phone number is is provided invoke the lambda and skip the email check
    if (signupDto.phone) {
      const lambdaResponse = await this.invokeCreateUserLambda(signupDto);
      const newUser = await this.userService.create({
        ...signupDto,
        phone: lambdaResponse.phone // Override with the phone received from Lambda, if necessary
      });
      return await this.authService.createToken(newUser);
    }

    // If the email does not exist, proceed with invoking the Lambda function
    const lambdaResponse = await this.invokeCreateUserLambda(signupDto);


    // Now, save this new user data in your own database
    const newUser = await this.userService.create({
      ...signupDto,
      email: lambdaResponse.email, // Override with the email received from Lambda, if necessary
    });

    return await this.authService.createToken(newUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request: IRequest): Promise<any> {
    return request.user;
  }
}
