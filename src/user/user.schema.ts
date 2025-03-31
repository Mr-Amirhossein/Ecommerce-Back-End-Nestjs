import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    min: [3, 'نام یاید  حداقل 3 کاراکتر باشد'],
    max: [20, 'نام نباید بیشتر از 20 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Prop({
    required: true,
    type: String,
    min: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'],
    max: [20, 'رمز عبور نباید بیشتر از 20 کاراکتر باشد'],
  })
  @ApiProperty({ example: 'password123' })
  password: string;

  @Prop({ required: true, type: String, enum: ['user', 'admin'] })
  @ApiProperty({ example: 'user' })
  role: string;

  @Prop({ type: String })
  @ApiProperty({ example: 'https://example.com/avatar.png' })
  avatar: string;

  @Prop({ type: Number })
  @ApiProperty({ example: 25 })
  age: number;

  @Prop({ type: String })
  @ApiProperty({ example: '123-456-7890' })
  phoneNumber: string;

  @Prop({ type: String })
  @ApiProperty({ example: '123 Main St, Anytown, USA' })
  address: string;

  @Prop({ type: Boolean, enum: [true, false] })
  @ApiProperty({ example: true })
  active: boolean;

  @Prop({ type: String })
  @ApiProperty({ example: '' })
  verificationCode: string;

  @Prop({ type: String, enum: ['male', 'female', 'other'] })
  @ApiProperty({ example: 'male' })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
