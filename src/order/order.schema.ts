import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';
import { getClassType } from 'src/utils/Ts';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {

  @Prop({ 
    type:mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @ApiProperty({ example: 'user' , description: ' کاربر' })
  user: typeof User;

    @Prop({
        type: String,
        required: false,
    })
    @ApiProperty({
        example: 'sessionId',
        description: 'شناسه سشن'
    })
  sessionId: string;

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
    @ApiProperty({
        example: [{ productId: 'product1', quantity: 1, color: 'red' }, { productId: 'product2', quantity: 2, color: 'blue' }],
        description: 'محصولات سبد خرید'
    })
    cartItems:[
            {
                productId: {
                    _id: string,
                    price: number,
                    priceAfterDiscount: number,
                };
                quantity: number;
                color: string;
            }
    ]

    @Prop({
        type: Number,
        default: 0,
        min: [0, 'مالیت نمی تواند منفی باشد'],
    })
    @ApiProperty({

        example: 0,
        description: 'مالیات بر اساس قیمت محصول'
    })
    taxPrice: number;

    @Prop({
        type: Number,
        default: 0,
        min: [0, 'هزینه ارسال نمی تواند منفی باشد'],
    })
    @ApiProperty({
        example: 0,
        description: 'هزینه ارسال بر اساس قیمت محصول'
    })
    shippingPrice: number;

    @Prop({
        required: true,
        type: Number,
    })
    @ApiProperty({
        example: 999,
        description: 'قیمت کل سفارش'
    })
    totalOrderPrice:number;


    @Prop({
        required: true,
        type: String,
        enum: ['card', 'cash'],
        default: 'card'
    })
    @ApiProperty({
        example: 'card or cash',
        description: 'نوع روش پرداخت'
    })
    paymentMethodType:string;


    @Prop({
        required: true,
        type: Boolean,
        default: 'false'
    })
    @ApiProperty({
        example: 'false or paid',
        description: 'وضعیت پرداخت'
    })
    isPaid:boolean;


    @Prop({
        type: Date,
    })
    @ApiProperty({
        example: '2023-10-01T00:00:00.000Z',
        description: 'تاریخ پرداخت'
    })
    paidAt: Date;


    @Prop({
        type: Boolean,
        default: false,
    })
    @ApiProperty({
        example: false,
        description: 'وضعیت تحویل'
    })
    isDelivered: boolean;

    @Prop({
        type: Date,
    })
    @ApiProperty({
        example: '2023-10-01T00:00:00.000Z',
        description: 'تاریخ تحویل'
    })
    deliverdAt: Date;

    
    @Prop({
        type: String,
        required: false,
    })
    @ApiProperty({
        example: '123 Main St, City, Country',
        description: 'آدرس ارسال'
    })
    shippingAddress: string
}

export const orderSchema = SchemaFactory.createForClass(Order)
