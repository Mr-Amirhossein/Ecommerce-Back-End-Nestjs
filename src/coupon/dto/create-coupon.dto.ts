import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsString({ message: 'نام کوپن باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام کوپن نمی تواند خالی باشد' })
  @ApiProperty({ example: 'Coupon Name' })
  name: string;

  @IsNotEmpty({ message: 'تاریخ انقضا نمی تواند خالی باشد' })
  @IsString({ message: 'تاریخ انقضا باید یک رشته باشد' })
  @IsDateString({}, { message: 'تاریخ انقضا باید یک تاریخ باشد' })
  @ApiProperty({
    example: new Date(),
  })
  expireDate: string;

  @IsNotEmpty({ message: 'درصد تخفیف نمی تواند خالی باشد' })
  @Min(0, {
    message: 'درصد تخفیف باید حداقل 0 باشد',
  })
  @IsNumber({}, { message: 'درصد تخفیف باید یک عدد باشد' })
  @ApiProperty({ example: 20 })
  discount: number;
}
