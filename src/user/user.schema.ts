import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({
    required: true,
    type: String,
    min: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'],
    max: [20, 'رمز عبور نباید بیشتر از 20 کاراکتر باشد'],
  })
  password: string;

  @Prop({ required: true, type: String, enum: ['user', 'admin'] })
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Boolean, enum: [true, false] })
  active: boolean;

  @Prop({ type: String })
  vrificationCode: string;

  @Prop({ type: String, enum: ['male', 'female', 'other'] })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
