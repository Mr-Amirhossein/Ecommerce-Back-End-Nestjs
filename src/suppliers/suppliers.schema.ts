import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type SuppliersDocument = HydratedDocument<Suppliers>;

@Schema({ timestamps: true })
export class Suppliers {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام باید حداقل 3 کاراکتر باشد'],
    max: [40, 'نام نباید بیشتر از 40 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'Supplier Name' })
  name: string;

  @Prop({
    type: String,
  })
  @ApiProperty({ example: 'https://example.com' })
  webSite: string;
}

export const suppliersSchema = SchemaFactory.createForClass(Suppliers);
