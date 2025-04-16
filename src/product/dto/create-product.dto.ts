import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, isURL, Length, Max, Min, Validate, validate } from "class-validator";

export class CreateProductDto {
    @IsString({ message: 'عنوان محصول باید یک رشته باشد' })
    @IsNotEmpty({ message: 'عنوان محصول نمی تواند خالی باشد' })
    @Length(3, 40, { message: 'عنوان محصول باید بین 3 تا 40 کاراکتر باشد' })
    @ApiProperty({ example: 'عنوان محصول',
        description: 'نام محصول باید حداقل 3 کاراکتر و حداکثر 40 کاراکتر باشد'
    })
    title: string;
    
    @IsString({ message: 'توضیحات محصول باید یک رشته باشد' })
    @IsNotEmpty({ message: 'توضیحات محصول نمی تواند خالی باشد' })
    @Length(3, 200, { message: 'توضیحات محصول باید بین 3 تا 200 کاراکتر باشد' })
    @ApiProperty({ example: 'توضیحات محصول',
        description: 'توضیحات محصول باید حداقل 3 کاراکتر و حداکثر 200 کاراکتر باشد'
    })
    description: string;
    
    @IsNumber({}, { message: 'موجودی محصول باید یک عدد باشد' })
    @Min(1, { message: 'موجودی محصول باید حداقل 1 باشد' })
    @ApiProperty({ example: 1,
        description: 'موجودی محصول باید حداقل 1 باشد و به صورت پیش فرض 1 در نظر گرفته می شود'
    })
    quantity: number;
    
    @IsString({ message: 'تصویر اصلی محصول باید یک رشته باشد' })
    @IsUrl({},{ message: 'تصویر اصلی محصول باید یک آدرس معتبر باشد' })
    @ApiProperty({ example: 'https://example.com/image.jpg',
        description: 'تصویر اصلی محصول باید یک آدرس معتبر باشد و به صورت پیش فرض تصویر عمومی در نظر گرفته می شود'
    })
    imageCover: string;
    
    @IsOptional()
    @IsArray({ message: 'تصاویر محصول باید یک آرایه باشد' })
    @ApiProperty({ example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        description: 'حداقل یک تصویر باید وجود داشته باشد و حداکثر 5 تصویر مجاز است'
    })
    images?: string[];
    
    @IsOptional()
    @IsNumber({}, { message: 'مقدار فروش باید یک عدد باشد' })
    @Min(0, { message: 'مقدار فروش نمی تواند کمتر از 0 باشد' })
    @ApiProperty({ example: 0,
        description: 'مقدار فروش نمی تواند کمتر از 0 باشد و به صورت پیش فرض 0 در نظر گرفته می شود'
    })
    sold: number;

    @IsNumber({}, { message: 'قیمت محصول باید یک عدد باشد' })
    @Min(100, { message: 'قیمت محصول نمی تواند کمتر از 100 تومان باشد' })
    @Max(1000000000, { message: 'قیمت محصول نمی تواند بیشتر از 1 میلیارد تومان باشد' })
    @ApiProperty({ example:  10000,
        description: 'قیمت محصول نمی تواند کمتر از 100 تومان باشد د'
    })
    price: number;

    @IsOptional()
    @IsNumber({}, { message: 'قیمت تخفیف باید یک عدد باشد' })
    @Min(0, { message: 'قیمت تخفیف نمی تواند کمتر از 0 تومان باشد' })
    @Max(1000000000, { message: 'قیمت تخفیف نمی تواند بیشتر از 1 میلیارد تومان باشد' })
    @ApiProperty({ example:  100000,
        description: 'قیمت تخفیف نمی تواند کمتر از 0 تومان باشد و به صورت پیش فرض 0 در نظر گرفته می شود'
    })
    priceAfterDiscount: number;

    @IsOptional()
    @IsArray({ message: 'رنگ های محصول باید یک آرایه باشد' })
    @ApiProperty({ example: ['قرمز', 'سبز', 'آبی'],
        description: 'رنگ های محصول باید یک آرایه از رشته ها باشد و به صورت پیش فرض رنگ عمومی در نظر گرفته می شود'
    })
    colores: string[];

    @IsOptional()
    @IsString({ message: 'دسته بندی محصول باید یک رشته باشد' })
    @IsNotEmpty({ message: 'دسته بندی محصول نمی تواند خالی باشد' })
    @ApiProperty({ example: 'دسته بندی محصول',
        description: 'دسته بندی محصول نمی تواند خالی باشد و به صورت پیش فرض عمومی در نظر گرفته می شود'
    })
    category: string;

    @IsOptional()
    @IsString({ message: 'زیر دسته بندی محصول باید یک رشته باشد' })
    @ApiProperty({ example: 'زیر دسته بندی محصول',
        description: 'زیر دسته بندی محصول نمی تواند خالی باشد و به صورت پیش فرض عمومی در نظر گرفته می شود'
    })
    subCategory: string;

    @IsOptional()
    @IsString({ message: 'برند محصول باید یک رشته باشد' })
    @IsNotEmpty({ message: 'برند محصول نمی تواند خالی باشد' })
    @ApiProperty({ example: 'برند محصول',
        description: 'برند محصول نمی تواند خالی باشد و به صورت پیش فرض عمومی در نظر گرفته می شود'
    })
    brand: string;

    @IsOptional()
    @IsNumber({}, { message: 'میانگین امتیاز باید یک عدد باشد' })
    @Min(0, { message: 'میانگین امتیاز نمی تواند کمتر از 0 باشد' })
    @Max(5, { message: 'میانگین امتیاز نمی تواند بیشتر از 5 باشد' })
    @ApiProperty({ example: 4.5,
        description: 'میانگین امتیاز نمی تواند کمتر از 0 باشد و نمی تواند بیشتر از 5 باشد'
    })
    ratingAverage: number;

    @IsOptional()
    @IsNumber({}, { message: 'تعداد امتیازها باید یک عدد باشد' })
    @Min(0, { message: 'تعداد امتیازها نمی تواند کمتر از 0 باشد' })
    @ApiProperty({ example: 100,
        description: 'تعداد امتیازها نمی تواند کمتر از 0 باشد و به صورت پیش فرض 0 در نظر گرفته می شود'
    })
    ratingQuantity: number;
}
