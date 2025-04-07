import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CreateTaxDto {

@IsNumber({}, { message: 'مقدار مالیات باید عدد باشد.' })
@IsOptional()
@ApiProperty({ example: 0, description: 'مقدار مالیات' })
    taxPrice: number;
    
@IsNumber({}, { message: 'مقدار هزینه حمل و نقل باید عدد باشد.' })
@IsOptional()
@ApiProperty({ example: 0 , description: 'هزینه حمل و نقل' })
    shippingPrice: number;
}
