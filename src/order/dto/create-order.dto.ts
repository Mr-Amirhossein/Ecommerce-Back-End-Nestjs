import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsOptional } from "class-validator";

export class CreateOrderDto {
     
    @IsOptional()
    @ApiProperty({
        example: 'استان تهران شهر تهران خیابان ولیعصر خیابان شریعتی پلاک 123',
        description: 'آدرس کاربر',
    })
    shippingAddress:string
}

export class AcceptOrderCashDto {
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, description: 'آیا پرداخت انجام شده است؟' })
    isPaid: boolean;
    @IsOptional()
    @IsDate()
    @ApiProperty({ example: new Date(), description: 'تاریخ پرداخت' })
    paidAt: Date;
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, description: 'آیا سفارش تحویل داده شده است؟' })
    isDeliverd: boolean;
    @IsOptional()
    @IsDate()
    @ApiProperty({ example: new Date(), description: 'تاریخ تحویل' })
    deliverdAt: Date;
}