import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type categoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام یاید  حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 20 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'Category Name' })
  name: string;

  @Prop({ type: String, default: '' })
  @ApiProperty({ example: 'Category Image' })
  image: string;
}

export const categorySchema = SchemaFactory.createForClass(Category);
