import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام باید حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 40 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'Coupon Name' })
  name: string;

  @Prop({
    required: true,
    type: Date,
    min: [Date.now(), 'تاریخ انقضا باید بزرگتر از تاریخ امروز باشد'],
  })
  expireDate: Date;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'درصد تخفیف باید حداقل 0 باشد'],
  })
  @ApiProperty({ example: 20 })
  disCount: number;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
