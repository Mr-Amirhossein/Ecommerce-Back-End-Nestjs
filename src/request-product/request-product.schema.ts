import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { User } from 'src/user/user.schema';

export type RequestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty({ example: 'نام محصول' })
  titleNeed: string;

  @Prop({
    type: String,
    required: true,
    min: [5, 'توضیحات باید حداقل 5 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'توضیحات محصول' })
  details: string;

  @Prop({
    type: Number,
    required: true,
    min: [1, 'تعداد محصول باید حداقل 1 باشد'],
  })
  @ApiProperty({ example: 10 })
  quantity: number;

  @Prop({
    type: String,
  })
  @ApiProperty({ example: 'دسته بندی محصول' })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @ApiProperty({ example: ' کاربر' })
  user: {
    _id: string;
  };
}

export const requestProductSchema =
  SchemaFactory.createForClass(RequestProduct);
