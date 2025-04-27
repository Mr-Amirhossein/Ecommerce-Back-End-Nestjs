import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './order.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Product, productSchema } from 'src/product/product.schema';
import { Cart, cartSchema } from 'src/cart/cart.schema';
import { Tax, TaxSchema } from 'src/tax/tax.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
    MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
