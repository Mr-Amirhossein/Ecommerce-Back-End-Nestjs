import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { User } from 'src/user/user.schema';

export class SignUpDto {
  // Name of the user
  @IsString({ message: 'نام باید یک رشته باشد' })
  @MinLength(3, { message: 'نام یاید  حداقل 3 کاراکتر باشد' })
  @MaxLength(20, { message: 'نام نباید بیشتر از 20 کاراکتر باشد' })
  @ApiProperty({ example: 'John Doe' })
  name: string;

  // Email of the user
  @IsString({ message: 'ایمیل باید یک رشته باشد' })
  @MinLength(0, { message: 'ایمیل یاید  حداقل 0 کاراکتر باشد' })
  @IsEmail({}, { message: 'ایمیل باید یک ایمیل معتبر باشد' })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  // Password of the user
  @IsString({ message: 'رمز عبور باید یک رشته باشد' })
  @MinLength(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' })
  @MaxLength(20, { message: 'رمز عبور نباید بیشتر از 20 کاراکتر باشد' })
  @ApiProperty({ example: 'yourpassword123' })
  password: string;
}

export class SignInDto {
  // Email of the user
  @IsString({ message: 'ایمیل باید یک رشته باشد' })
  @MinLength(0, { message: 'ایمیل یاید  حداقل 0 کاراکتر باشد' })
  @IsEmail({}, { message: 'ایمیل باید یک ایمیل معتبر باشد' })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  // Password of the user
  @IsString({ message: 'رمز عبور باید یک رشته باشد' })
  @MinLength(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' })
  @MaxLength(20, { message: 'رمز عبور نباید بیشتر از 20 کاراکتر باشد' })
  @ApiProperty({ example: 'yourpassword123' })
  password: string;
}

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
