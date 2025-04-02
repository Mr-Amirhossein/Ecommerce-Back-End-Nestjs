import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class GetAllBrandsResponseDto {
  @ApiProperty({
    type: String,
    description: ' لیست برندها با موفقیت دریافت شد',
  })
  message: string;
  @ApiProperty({
    type: [CreateBrandDto],
    isArray: true,
    description: 'لیست برندها',
  })
  brands: CreateBrandDto[];

  @ApiProperty({
    type: Number,
    description: 'تعداد کل برندها',
  })
  totalCount: number;
}

export class GetOneBrandResponseDto {
  @ApiProperty({
    type: String,
    description: 'برند با موفقیت دریافت شد',
  })
  message: string;

  @ApiProperty({
    type: CreateBrandDto,
    description: 'برند',
  })
  brand: CreateBrandDto;
}

export class UpdateBrandResponseDto {
  @ApiProperty({
    type: String,
    description: 'برند با موفقیت ویرایش شد',
  })
  message: string;

  @ApiProperty({
    type: CreateBrandDto,
    description: 'برند',
  })
  brand: CreateBrandDto;
}
