import { ApiProperty } from "@nestjs/swagger";
import { IsMagnetURI, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsOptional()
    @IsString({ message: 'متن نظر باید از نوع رشته باشد' })
    @MinLength(3, { message: 'متن نظر باید حداقل 3 کاراکتر باشد' })
    @ApiProperty({
        example: 'این محصول عالی است',
        description: 'متن نظر',
    })
    reviewTex: string;
    
    @IsNumber({}, { message: 'امتیاز نظر باید از نوع عدد باشد' })
    @Min(1, { message: 'امتیاز نظر باید حداقل 1 باشد' })
    @ApiProperty({
        example: 4.1,
        description: 'امتیاز نظر',
    })
    rating: number;


    @IsString({ message: 'محصول باید از نوع رشته باشد' })
    @IsMongoId({ message: 'محصول باید یک شناسه معتبر باشد' })
    @ApiProperty({
        example: 'product',
        description: 'محصول',
    })
    product: string;
}
