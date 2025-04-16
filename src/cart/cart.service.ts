import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartItemsDto } from './dto/update-cart.dto';
import { Cart } from './cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';


@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}
  async create(productId: string, userId: string) {

    const cart = await this.cartModel.findOne({ user: userId }).populate('cartItems.productId', 'title price quantity priceAfterDiscount _id');
    const product = await this.productModel.findById(productId);
    
    if (!product) {
      throw new HttpException('محصول یافت نشد', 404);
    }

    if (product.quantity <= 0) {
      throw new HttpException('محصول موجود نیست', 404);
    }

    if (cart) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let ifProductAlredyInsert:{
        ifAdd: boolean;
        indexProduct: number;
      } = {
        ifAdd: false,
        indexProduct: 0,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let totalPriceCartBeforAdd = 0;
      cart.cartItems.map((item, index) => {
        if (item.productId._id.toString() === productId.toString()) {
          ifProductAlredyInsert ={
            ifAdd: true,
            indexProduct: index
          }
          totalPriceCartBeforAdd += item.productId.price * item.quantity - item.productId.priceAfterDiscount;
        }});
        
        const cloneCartItems = cart.cartItems
      if (ifProductAlredyInsert.ifAdd) {
        cloneCartItems[ifProductAlredyInsert.indexProduct].quantity += 1;
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        cloneCartItems.push({ productId: productId, quantity: 1, color: '' });

      }
      const updateCartAndAddProduct = await this.cartModel.findOneAndUpdate(
        { user: userId },
        {
          cartItems: cloneCartItems,
          totalPrice: cart.totalPrice + product.price - product.priceAfterDiscount,
        },
        { new: true },
      ).populate('cartItems.productId', 'title description price  priceAfterDiscount _id');

      return {
          statusCode: 200,
          message: 'سبد خرید با موفقیت به روز شد',
          cart: updateCartAndAddProduct,
        };
    }
  
    else{

      const newCart =await (await this.cartModel.create({
        cartItems: [
          {
            productId: productId
          },
        ],
        totalPrice: product?.price - product.priceAfterDiscount,
        user: userId,
      })).populate('cartItems.productId' , 'title description price  priceAfterDiscount _id');
      return {
          statusCode: 201,
          message: 'سبد خرید جدید با موفقیت ایجاد شد',
          cart: newCart,
        }
    }
  }

  async findAll() {
    return `This action returns all cart`;
  }

  async findOne(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId }).select('-__v')
    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }
    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت دریافت شد',
      cart: cart,
    }
  }

  async update(productId: string, updateCartItemsDto: UpdateCartItemsDto, userId: string) {
    const cart = await this.cartModel.findOne({ user: userId }).populate('cartItems.productId', 'name price quantity priceAfterDiscount _id');

    const product = await this.productModel.findById(productId)
    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }
    
    if(!cart){
      const result = await this.create(productId, userId);
      return result;
    }

    const indexProductUpdate = cart.cartItems.findIndex((item) => item.productId._id.toString() === productId.toString());
    if (indexProductUpdate === -1) {
      throw new NotFoundException('محصول در سبد خرید وجود ندارد');
    }

    if(updateCartItemsDto.color) {
      cart.cartItems[indexProductUpdate].color = updateCartItemsDto.color;
    }


    let totalPrice =0
    if (updateCartItemsDto.quantity) {
      cart.cartItems[indexProductUpdate].quantity = updateCartItemsDto.quantity;
     cart.cartItems.map((item) => {
        totalPrice += (item.productId.price * item.quantity) - item.productId.priceAfterDiscount * item.quantity;
      });
      cart.totalPrice = totalPrice;
    }

    const updatedCart = await this.cartModel.findOneAndUpdate(
      { user: userId },
      {
        cartItems: cart.cartItems,
        totalPrice: cart.totalPrice,
      },
      { new: true },
    ).populate('cartItems.productId', 'title description price  priceAfterDiscount _id');
    
    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت به روز شد',
      cart: updatedCart,
    }
  }



  async remove(productId: string, userId: string) {

    const cart = await this.cartModel.findOne({ user: userId }).populate('cartItems.productId', 'title description quantity price  priceAfterDiscount _id');
    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }
    
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    } 
    const indexProductDelete = cart.cartItems.findIndex((item) => item.productId._id.toString() === productId.toString());
    if (indexProductDelete === -1) {
      throw new NotFoundException('محصول در سبد خرید وجود ندارد');
    }

    // eslint-disable-next-line
    // @ts-ignore
   cart.cartItems = cart.cartItems.filter((_, index) => index !== indexProductDelete);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalPrice = 0;
    cart.cartItems.map((item) => {
      totalPrice += item.quantity * item.productId?.price;
    });

    cart.totalPrice = totalPrice;


    await cart.save();

    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت حذف شد',
      cart: cart, 
    };
  }

  async applyCoupons(id: string, coupons: string[]) {

    return `Coupons applied: ${coupons.join(', ')}, new total price`;
  }
}
