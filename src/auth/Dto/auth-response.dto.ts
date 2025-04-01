import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example: 'کاربر با موفقیت وارد شد',
  })
  message: string;

  @ApiProperty({
    example: {
      name: 'John Doe',
      email: 'user@example.com',
      password: 'yourpassword123',
      role: 'user',
      active: true,
      id: 'unique_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    },
  })
  user: {
    name: string;
    email: string;
    password: string;
    role: string;
    active: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'توکن دسترسی JWT',
  })
  access_token: string;
}

export class SignUpResponseDto {
  @ApiProperty({ example: 'کاربر با موفقیت ثبت نام شد' })
  message: string;

  @ApiProperty({
    example: {
      name: 'John Doe',
      email: 'user@example.com',
      password: 'yourpassword123',
      role: 'user',
      active: true,
      id: 'unique_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    },
  })
  user: {
    name: string;
    email: string;
    password: string;
    role: string;
    active: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'توکن دسترسی JWT',
  })
  access_token: string;

  // Replace with proper user type
}

export class ResetPasswordResponseDto {}

export class VirifyCodeResponseDto {
  @ApiProperty({
    example: 'اعمال با موفقیت انجام شد',
  })
  message: string;

  @ApiProperty({
    example: '‍کد تایید 123456',
  })
  code: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({
    example: 'رمز عبور با موفقیت تغییر یافت',
  })
  message: string;
}
