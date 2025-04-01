import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import e from 'express';

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

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
