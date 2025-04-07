import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsString({ message: 'نام محصول باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام محصول الزامی است' })
  @ApiProperty({ example: 'نام محصول' })
  titleNeed: string;

  @IsString({ message: 'توضیحات محصول باید یک رشته باشد' })
  @MinLength(5, {
    message: 'توضیحات محصول باید حداقل 5 کاراکتر باشد',
  })
  @ApiProperty({ example: 'توضیحات محصول' })
  details: string;

  @IsNotEmpty({ message: 'تعداد محصول الزامی است' })
  @IsNumber({}, { message: 'تعداد محصول باید یک عدد باشد' })
  @Min(1, {
    message: 'تعداد محصول باید حداقل 1 باشد',
  })
  @ApiProperty({ example: 10 })
  quantity: number;

  @IsOptional()
  @IsString({ message: 'دسته بندی محصول باید یک رشته باشد' })
  @ApiProperty({ example: 'دسته بندی محصول' })
  category: string;
}
