import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartAdminService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>, 
  ){}

  async getCarts() {
    const carts = await this.cartModel.find()
    .populate('cartItems.productId user coupons coupons.couponId','name email expireDate price title description');
    return{
      status: 200,
      message: 'لیست سبد خرید با موفقیت دریافت شد',
      carts: carts
    }
  }

}
