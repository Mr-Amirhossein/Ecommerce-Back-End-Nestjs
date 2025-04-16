import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
    
      @Prop({ 
        type: [{
            productId: {
              required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: Product.name,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: {
                type: String,
                default: '',
            },
        }],
        required: true,
      })
      @ApiProperty({ example: [{ productId: 'product1', quantity: 1, color: 'red' }, { productId: 'product2', quantity: 2, color: 'blue' }], description: 'محصولات سبد خرید' })
      cartItems: [
          {
              productId: {
                _id:string,
                price: number,
                  priceAfterDiscount: number, 
                };
              quantity: number;
              color: string;
          }
      ];
    
    @Prop({
        type: Number,
    min:[0, 'قیمت نمی تواند منفی باشد'],
  })
  @ApiProperty({ example: 1000 , description: 'قیمت کل سبد خرید' })
  totalPrice: number;

  @Prop({
    type: Number,
        min: [0, 'قیمت نمی تواند منفی باشد'],
  })
  @ApiProperty({ example: 800 , description: 'قیمت کل سبد خرید بعد از تخفیف' })
  totalPriceAfterDiscount: number;

  @Prop({ 
    type: [{
      name: { type: String },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Coupon.name,
      },
    }]
  })
  @ApiProperty({ example: ['code1', 'code2'] , description: 'کد تخفیف' })
  coupons: [
    {
      name: string;
      couponId: number;
    }
  ];

  @Prop({ 
    type:mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @ApiProperty({ example: 'user' , description: ' کاربر' })
  user: string;
}
export const cartSchema = SchemaFactory.createForClass(Cart);
