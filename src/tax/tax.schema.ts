import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type TaxDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
  @Prop({
    type: Number,
    default: 0,
  })
  @ApiProperty({ example: 'Supplier Name' })
  taxPrice: number;

  @Prop({
    type: Number,
    default:0
  })
  @ApiProperty({ example: 'https://example.com' })
  shippingPrice: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);
