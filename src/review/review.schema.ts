import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: String,
    min: [3, 'متن نظر باید حداقل 3 کاراکتر باشد'],
    max: [100, 'متن نظر باید حداکثر 100 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'Review tex....' , description: 'متن نظر' })
  reviewTex: string;

  @Prop({ 
    type: Number,
     required: true,
    min: [1, 'امتیاز نظر باید حداقل 1 باشد'], 
    max: [5, 'امتیاز نظر باید حداکثر 5 باشد']
   })
  @ApiProperty({ example: 4.1 , description: 'امتیاز نظر' })
  rating: number;

  @Prop({ 
    required: true,
    type:mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @ApiProperty({ example: 'use' , description: ' کاربر' })
  user: string;
  @Prop({ 
    required: true,
    type:mongoose.Schema.Types.ObjectId,
    ref: Product.name
  })
  @ApiProperty({ example: 'product' , description: 'محصول' })
  product: string;
}

export const reviewSchema = SchemaFactory.createForClass(Review);
