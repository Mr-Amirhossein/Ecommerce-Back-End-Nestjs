import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateCartDto {
    @IsOptional()
    @IsNumber({},{message: 'قیمت کل سبد خرید باید عدد باشد'})
    @Min(1, { message: 'قیمت کل سبد خرید نمی تواند منفی باشد' })
    @Max(1000000000, { message: 'قیمت کل سبد خرید نمی تواند بیشتر از 1 میلیارد باشد' })
    @ApiProperty({ example: 1000, description: 'قیمت کل سبد خرید' })
    totalPrice: number;
       
    @IsOptional()
    @IsArray({ message: 'کد های تخفیف باید یک آرایه باشد' })
    @ApiProperty({ example: [{ name: 'code1', couponId: 'coupon1' }], description: 'کد های تخفیف' })
    coupons: [
        {
            name: string;
            couponId: string;
        }
    ];
    
    @IsNotEmpty({ message: 'محصولات سبد خرید نمی تواند خالی باشد' })
    @IsArray({ message: 'محصولات سبد خرید باید یک آرایه باشد' })
    @ApiProperty({ example: [{ id: 'product1', name: 'Product 1' }, { id: 'product2', name: 'Product 2' }], description: 'محصولات سبد خرید' })
    cartItems: [
        {
            productId: string;
            quantity: number;
            color: string;
        }
    ];
}
