import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './Dto/auth.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @docs Sign Up
  // @Route Post /api/v1/auth/sign-up
  // @Access public
  @ApiOperation({ summary: 'ثبت نام کاربر' })
  @ApiOkResponse({
    type: SignUpResponseDto,
    description: 'کاربر با موفقیت ثبت نام شد.',
  })
  @Post('sign-up')
  async signUp(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    signUpDto: SignUpDto,
  ) {
    return await this.authService.signUp(signUpDto);
  }

  // @docs Sign In
  // @Route Post /api/v1/auth/sign-in
  // @Access public

  @ApiOperation({ summary: 'ورود کاربر' })
  @ApiOkResponse({
    type: SignInResponseDto,
    description: 'کاربر با موفقیت وارد شد.',
  })
  @Post('sign-in')
  async signIn(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    signInDto: SignInDto,
  ) {
    return await this.authService.signIn(signInDto);
  }
}
