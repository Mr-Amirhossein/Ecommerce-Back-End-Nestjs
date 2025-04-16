import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema.';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام باید حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 40 کاراکتر باشد'],
  })
  @ApiProperty({ example:'عنوان محصول' ,
    description: 'نام محصول باید حداقل 3 کاراکتر و حداکثر 40 کاراکتر باشد'
  })
  title: string;

  @Prop({
    required: true,
    type: String,
    min: [3, 'توضیحات باید حداقل 3 کاراکتر باشد'],
    max: [200, 'توضیحات نباید بیشتر از 200 کاراکتر باشد'],
  })
  @ApiProperty({ example:'توضیحات محصول' ,
    description: 'توضیحات محصول باید حداقل 3 کاراکتر و حداکثر 200 کاراکتر باشد'
  })
  description: string;

  @Prop({
    required: true,
    type: Number,
    default: 1,
    min: [1,'موجودی محصول باید حداقل 1 باشد'],
  })
  @ApiProperty({ example:'موجودی محصول' ,
    description: 'موجودی محصول باید حداقل 1 باشد و به صورت پیش فرض 1 در نظر گرفته می شود'
  })
  quantity: number;

  @Prop({
    required: true,
    type: String,
  })  
  @ApiProperty({ example:'تصویر اصلی محصول' ,
    description: 'تصویر اصلی محصول باید یک آدرس معتبر باشد و به صورت پیش فرض تصویر عمومی در نظر گرفته می شود'
  })
  imageCover: string;

  @Prop({
    required: false,
    type: Array,
    minlength: [1, 'حداقل یک تصویر باید وجود داشته باشد'],
    maxlength: [5, 'حداکثر 5 تصویر مجاز است'],
  })
  @ApiProperty({ example:'تصویر محصول' ,
    description: 'حداقل یک تصویر باید وجود داشته باشد و حداکثر 5 تصویر مجاز است'
  })
  images: string[];

  @Prop({
    required: false,
    type: Number,
    default: 0,
    min: [0, 'مقدار فروش نمی تواند کمتر از 0 باشد'],
  })
  @ApiProperty({ example:'مقدار فروش',
    description: 'مقدار فروش نمی تواند کمتر از 0 باشد و به صورت پیش فرض 0 در نظر گرفته می شود'
   })
  sold:number

@Prop({
  required: true,
  type: Number,
  min: [1000, 'قیمت محصول نمی تواند کمتر از ۱۰۰۰ تومان باشد باشد'],
  max :[1000000000, 'قیمت محصول نمی تواند بیشتر از ۱۰۰۰۰۰۰۰۰۰ تومان باشد'],
})
@ApiProperty({ example:'قیمت محصول' ,
  description: 'قیمت محصول نمی تواند کمتر از ۱۰۰۰ تومان باشد و نمی تواند بیشتر از ۱۰۰۰۰۰۰۰۰۰ تومان باشد'
})
  price:number

  @Prop({
    required: false,
    type: Number,
    min: [1, 'قیمت با احتساب تخفیف نمی تواند کمتر از 0 باشد'],
    max: [1000000000, 'قیمت با احتساب تخفیف نمی تواند بیشتر از ۱۰۰۰۰۰۰۰۰۰ تومان باشد'],
  })
  @ApiProperty({ example: 'قیمت با احتساب تخفیف',
    description: 'قیمت با احتساب تخفیف می تواند خالی باشد و در صورت خالی بودن به صورت پیش فرض قیمت اصلی در نظر گرفته می شود'
   })
  priceAfterDiscount:number

  @Prop({
    required: false,
    type: Array,
  })
  @ApiProperty({ example:'رنگ های محصول' ,
    description: 'رنگ های محصول می تواند خالی باشد و در صورت خالی بودن به صورت پیش فرض رنگ سفید در نظر گرفته می شود'
  })
  colores: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
  })
  @ApiProperty({ example:'دسته بندی محصول' ,
    description: 'دسته بندی محصول می تواند خالی باشد و در صورت خالی بودن به صورت پیش فرض دسته بندی عمومی در نظر گرفته می شود'
  })
  category: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  @ApiProperty({ example:'زیر دسته بندی محصول' ,
    description: 'زیر دسته بندی می تواند خالی باشد و در صورت خالی بودن به صورت پیش فرض زیر دسته بندی عمومی در نظر گرفته می شود'
  })
  subCategory: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  @ApiProperty({ example:'برند محصول',
    description: 'برند محصول می تواند خالی باشد و در صورت خالی بودن به صورت پیش فرض برند عمومی در نظر گرفته می شود'
   })
  brand: string;


  @Prop({
    required: false,
    type: Number,
    default: 0,
    min: [0, 'امتیاز نمی تواند کمتر از 0 باشد'],
    max: [5, 'امتیاز نمی تواند بیشتر از 5 باشد'],
  })
  @ApiProperty({ example:'امتیاز محصول' ,
    description: 'امتیاز محصول از 0 تا 5 می باشد و به صورت اعشاری می باشد'
   })
  ratingsAverage: number;

  @Prop({
    required: false,
    type: Number,
    default: 0,
    min: [0, 'تعداد امتیاز نمی تواند کمتر از 0 باشد'],
  })
  @ApiProperty({ example:'تعداد امتیاز محصول' ,
    description: 'تعداد امتیاز محصول نمی تواند کمتر از 0 باشد و به صورت پیش فرض 0 در نظر گرفته می شود'
   })
  ratingsQuantity: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
