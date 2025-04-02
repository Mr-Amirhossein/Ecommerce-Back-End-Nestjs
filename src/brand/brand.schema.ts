import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام باید حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 40 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'Brand Name' })
  name: string;

  @Prop({ type: String })
  @ApiProperty({ example: 'Brand Image' })
  image: string;
}

export const brandSchema = SchemaFactory.createForClass(Brand);
