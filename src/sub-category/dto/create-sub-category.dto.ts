import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubCategoryDto {
  @IsString({ message: 'نام زیر دسته باید یک رشته باشد' })
  @MinLength(3, { message: 'نام زیر دسته باید حداقل 3 کاراکتر باشد' })
  @MaxLength(50, { message: 'نام زیر دسته باید حداکثر 50 کاراکتر باشد' })
  @IsNotEmpty({ message: 'نام زیر دسته نمی تواند خالی باشد' })
  @ApiProperty({
    description: 'نام زیر دسته',
    example: 'زیر دسته 1',
  })
  name: string;

  @IsString({ message: 'نام دسته باید یک رشته باشد' })
  @IsNotEmpty({ message: 'شناسه دسته نمی تواند خالی باشد' })
  @IsMongoId({ message: 'شناسه دسته باید یک شناسه معتبر باشد' })
  @ApiProperty({
    description: 'شناسه دسته',
    example: 'شناسه دسته 4563421356357',
  })
  category: string;
}
