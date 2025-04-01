import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'نام دسته بندی باید یک رشته باشد.' })
  @MinLength(3, { message: 'نام دسته بندی باید حداقل 3 کاراکتر باشد.' })
  @MaxLength(50, { message: 'نام دسته بندی باید حداکثر 50 کاراکتر باشد.' })
  @IsNotEmpty({ message: 'نام دسته بندی الزامی است.' })
  @ApiProperty({
    description: 'نام دسته بندی',
    example: 'دسته بندی محصولات',
  })
  name: string;

  @IsString({ message: 'آدرس تصویر باید یک رشته باشد.' })
  @IsUrl({}, { message: 'آدرس تصویر باید یک URL معتبر باشد.' })
  @IsOptional()
  @ApiProperty({
    description: 'آدرس تصویر دسته بندی',
    example: 'http://example.com/image.png',
  })
  image: string;
}
