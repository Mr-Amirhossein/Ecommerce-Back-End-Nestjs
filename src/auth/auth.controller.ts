import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ResetPasswordResponseDto,
  SignInResponseDto,
  SignUpResponseDto,
  VirifyCodeResponseDto,
  ChangePasswordResponseDto,
} from './Dto/auth-response.dto';

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

  // @docs Reset Password
  // @Route Post /api/v1/auth/reset-password
  // @Access public
  @ApiOperation({ summary: 'بازیابی رمز عبور' })
  @ApiOkResponse({
    type: ResetPasswordResponseDto,
    description: 'رمز عبور با موفقیت بازیابی شد.',
  })
  @Post('reset-password')
  async resetPassword(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    email: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(email);
  }

  // @docs Verify Code
  // @Route Post /api/v1/auth/verify-code
  // @Access public
  @ApiOperation({ summary: 'تایید کد بازیابی' })
  @ApiOkResponse({
    type: VirifyCodeResponseDto,
    description: 'کد بازیابی با موفقیت تایید شد.',
  })
  @Post('virify-code')
  async virifyCode(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    virifyCode: {
      email: string;
      code: string;
    },
  ) {
    return await this.authService.virifyCode(virifyCode);
  }

  // @docs Change Password
  // @Route Post /api/v1/auth/change-password
  // @Access private For users => [user, admin]
  @ApiOperation({ summary: 'تغییر رمز عبور' })
  @ApiOkResponse({
    type: ChangePasswordResponseDto,
    description: 'رمز عبور با موفقیت تغییر کرد.',
  })
  @Post('change-password')
  async changePassword(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    changePasswordData: SignInDto,
  ) {
    return await this.authService.changePassword(changePasswordData);
  }
}
