import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCartItemsDto extends PartialType(CreateCartDto) {
    @IsOptional()
    @IsNumber({}, { message: 'تعداد باید عدد باشد' })
    @Min(1, { message: 'تعداد نمی تواند کمتر از 1 باشد' })
    @Max(1000000000, { message: 'تعداد نمی تواند بیشتر از 1 میلیارد باشد' })
    @ApiProperty({ example: 1, description: 'تعداد محصول' })
    quantity: number;

    @IsOptional()
@IsString({ message: 'رنگ باید رشته باشد' })
    @ApiProperty({ example: 'red', description: 'رنگ محصول' })
    color: string;
}
