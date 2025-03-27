import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsUrl,
  MinLength,
  MaxLength,
  Length,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  // Name of the user
  @IsString({ message: 'نام باید یک رشته باشد' })
  @MinLength(3, { message: 'نام یاید  حداقل 3 کاراکتر باشد' })
  @MaxLength(20, { message: 'نام نباید بیشتر از 20 کاراکتر باشد' })
  @ApiProperty()
  name: string;

  // Email of the user
  @IsString({ message: 'ایمیل باید یک رشته باشد' })
  @MinLength(0, { message: 'ایمیل یاید  حداقل 0 کاراکتر باشد' })
  @IsEmail({}, { message: 'ایمیل باید یک ایمیل معتبر باشد' })
  @ApiProperty()
  email: string;

  // Password of the user
  @IsString({ message: 'رمز عبور باید یک رشته باشد' })
  @MinLength(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' })
  @MaxLength(20, { message: 'رمز عبور نباید بیشتر از 20 کاراکتر باشد' })
  @ApiProperty()
  password: string;

  // Role of the user
  @IsEnum(['user', 'admin'], {
    message: 'نقش باید یکی از مقادیر user یا admin باشد',
  })
  @IsOptional()
  @ApiProperty()
  role: string;

  // Avatar of the user
  @IsString({ message: 'آواتار باید یک رشته باشد' })
  @IsUrl({}, { message: 'آواتار باید یک آدرس اینترنتی باشد' })
  @IsOptional()
  @ApiProperty()
  avatar: string;

  // Age of the user
  @IsNumber({}, { message: 'سن باید یک عدد باشد' })
  @IsOptional()
  @ApiProperty()
  age: number;

  // Phone number of the user
  @IsString({ message: 'شماره تلفن باید یک رشته باشد' })
  @IsPhoneNumber('IR', {
    message: 'شماره تلفن باید یک شماره تلفن معتبر باشد',
  })
  @MinLength(11, { message: 'شماره تلفن باید 11 رقم باشد' })
  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  // Address of the user
  @IsString({ message: 'آدرس باید یک رشته باشد' })
  @IsOptional()
  @ApiProperty()
  address: string;

  // Active status of the user
  @IsBoolean({ message: 'وضعیت باید یک بولین باشد' })
  @IsEnum([true, false], {
    message: 'وضعیت باید یکی از مقادیر true یا false باشد',
  })
  @IsOptional()
  @ApiProperty()
  active: boolean;

  // Verification code of the user
  @IsString({ message: 'کد تأیید باید یک رشته باشد' })
  @Length(6, 6, { message: 'کد تأیید باید 6 کاراکتر باشد' })
  @IsOptional()
  @ApiProperty()
  verificationCode: string;

  // Gender of the user
  @IsEnum(['male', 'female'], {
    message: 'جنسیت باید یکی از مقادیر male، female باشد',
  })
  @IsOptional()
  @ApiProperty()
  gender: string;
}
