import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from './cart.schema';
import { Product, productSchema } from 'src/product/product.schema';
import { Coupon, couponSchema } from 'src/coupon/coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: couponSchema }]), // Assuming you have a Coupon schema
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
