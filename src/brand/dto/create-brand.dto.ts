import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'نام برند باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام برند الزامی است' })
  @MinLength(3, {
    message: 'نام برند باید حداقل 3 کاراکتر باشد',
  })
  @MaxLength(40, {
    message: 'نام برند نباید بیشتر از 40 کاراکتر باشد',
  })
  @ApiProperty({
    example: 'Brand Name',
    description: 'نام برند',
    required: true,
  })
  name: string;

  @ApiProperty({ example: 'Brand Image', description: 'تصویر برند' })
  @IsUrl(
    {},
    {
      message: 'لینک تصویر برند باید یک URL معتبر باشد',
    },
  )
  @IsString({ message: 'تصویر برند باید یک رشته باشد' })
  @IsOptional()
  image: string;
}
