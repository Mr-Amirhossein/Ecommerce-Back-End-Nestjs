import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'نام تامین کننده باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام تامین کننده نمی تواند خالی باشد' })
  @MinLength(3, { message: 'نام تامین کننده باید حداقل 3 کاراکتر باشد' })
  @MaxLength(40, { message: 'نام تامین کننده نباید بیشتر از 40 کاراکتر باشد' })
  @ApiProperty({
    example: 'Supplier Name',
    description: 'نام تامین کننده',
  })
  name: string;

  @IsString({ message: 'وب‌سایت باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وب‌سایت نمی تواند خالی باشد' })
  @IsUrl({}, { message: 'لطفا یک URL معتبر وارد کنید' })
  @MinLength(3, { message: 'وب‌سایت باید حداقل 3 کاراکتر باشد' })
  @MaxLength(100, { message: 'وب‌سایت نباید بیشتر از 100 کاراکتر باشد' })
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com',
    description: 'وب‌سایت تامین کننده',
  })
  webSite: string;
  // Add other properties as needed
}
