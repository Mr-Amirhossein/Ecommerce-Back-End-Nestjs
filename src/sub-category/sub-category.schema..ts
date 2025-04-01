import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.schema';

export type subCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام یاید  حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 40 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'SubCategory Name' })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
  })
  @ApiProperty({ example: 'Category Name' })
  category: String;
}

export const subCategorySchema = SchemaFactory.createForClass(SubCategory);
