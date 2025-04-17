import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@ObjectType()
export class LocalUser {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)

    email: string;
}
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
        @Field(() => [CartItem])
      cartItems: [];
    
    @Prop({
        type: Number,
        required: true,
    min:[0, 'قیمت نمی تواند منفی باشد'],
  })
    @Field(() => Number)
  totalPrice: number;

  @Prop({
    type: Number,

        min: [0, 'قیمت بعد از تخفیف نمی تواند منفی باشد'],
  })
    @Field(() => Number)
  totalPriceAfterDiscount?: number;

  @Prop({ 
    type: [{
      name: { type: String },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Coupon.name,
      },
    }]
  })
    @Field(() => [LocalCoupon])
  @ApiProperty({ example: ['code1', 'code2'] , description: 'کد تخفیف' })
  coupons: LocalCoupon[];

  @Prop({ 
    type:mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
    @Field(() => LocalUser)
  @ApiProperty({ example: 'user' , description: ' کاربر' })
  user: LocalUser;
}
export const cartSchema = SchemaFactory.createForClass(Cart);



    @ObjectType()
    export class LocalCoupon {
        @Field(() => String)
        _id: string;

        @Field(() => String)
        name: string;
        
        @Field(() => Date)
        expireDate: Date;
    }

    @ObjectType()
    export class LocalProduct {
        @Field(() => String)
        _id: string;

        @Field(() => Int)
        price: number;

        @Field(() => Int)    
        totalPriceAfterDiscount: number;
        
        @Field(() => String)
        color: string;
    }
@ObjectType()
export class CartItem {
    @Field(() => LocalProduct)
    productId: LocalProduct;

    @Field(() => Int)
    quantity: number;

    @Field(() => String)
    color: string;
}

