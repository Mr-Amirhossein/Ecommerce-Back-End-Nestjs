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
  async create(productId: string, userId: string, isElse?: boolean) {

    const cart = await this.cartModel.findOne({ user: userId }).populate('cartItems.productId', 'title price  priceAfterDiscount _id');
    const product = await this.productModel.findById(productId);
    
    if (!product) {
      throw new HttpException('محصول یافت نشد', 404);
    }

    if (product.quantity <= 0) {
      throw new HttpException('محصول موجود نیست', 404);
    }

    
    if (cart) {
      // add first product=> insert product in cart

      const indexIfProductAlridyInsert = cart.cartItems.findIndex(
        // -1 not found
        (item) => item.productId._id.toString() === productId.toString(),
      );

      if (indexIfProductAlridyInsert !== -1) {
        cart.cartItems[indexIfProductAlridyInsert].quantity += 1;
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        cart.cartItems.push({ productId: productId, color: '', quantity: 1 });
      }

      await cart.populate('cartItems.productId', 'title price quantity priceAfterDiscount');


      if (cart.cartItems[0].quantity > product.quantity) {
        throw new HttpException('تعداد محصول باید کمتر یا مساوی  موجودی باشد', 400);
      }


      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let totalPriceAfterInsert = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let totalDiscountPriceAfterInsert = 0;

      cart.cartItems.map((item) => {
        totalPriceAfterInsert += item.quantity * item.productId.price;
        totalDiscountPriceAfterInsert +=
          item.quantity * item.productId.priceAfterDiscount;
      });

      cart.totalPrice = totalPriceAfterInsert - totalDiscountPriceAfterInsert;

      await cart.save();
      if (isElse) {
     return cart
      }else{
      return {
        statusCode: 200,
        message: 'محصول با موفقیت به سبد خرید اضافه شد',
        cart: cart,
      }
    }
    } else {

      await this.cartModel.create({
        cartItems: [],
        totalPrice: 0,
        user: userId,
      })
      const insertProduct = await this.create(productId, userId,isElse= true);
      return {
          statusCode: 201,
          message: 'سبد خرید جدید با موفقیت ایجاد شد',
          cart: insertProduct,
        }
    }
  }

  async findAll() {
    const carts = await this.cartModel.find().populate('cartItems.productId', 'title price quantity priceAfterDiscount _id').select('-__v');
    if (!carts) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }
    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت دریافت شد',
      carts: carts,
    };
  }


  async findOne(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId })
    .populate('cartItems.productId', 'title price priceAfterDiscount _id')
    .select('-__v')
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

    if (updateCartItemsDto.quantity > product.quantity) {
      throw new HttpException('تعداد محصول باید کمتر یا مساوی  موجودی باشد', 400);
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalPriceAfterUpdate = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalDiscountPriceAfterUpdate = 0;


    if (updateCartItemsDto.quantity) {
      cart.cartItems[indexProductUpdate].quantity = updateCartItemsDto.quantity;
      cart.cartItems.map((item) => {

        totalPriceAfterUpdate += item.quantity * item.productId.price;
        totalDiscountPriceAfterUpdate +=
          item.quantity * item.productId.priceAfterDiscount;
      });

      cart.totalPrice = totalPriceAfterUpdate - totalDiscountPriceAfterUpdate;

    }

    await cart.save();

    return {
      statusCode: 200,
      message: 'محصول با موفقیت به سبد خرید به روز رسانی شد',
      cart: cart,
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
    let totalPriceAfterUpdate = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalDiscountPriceAfterUpdate = 0;

      cart.cartItems.map((item) => {
        totalPriceAfterUpdate += item.quantity * item.productId.price;
        totalDiscountPriceAfterUpdate +=
          item.quantity * item.productId.priceAfterDiscount;
      });

      cart.totalPrice = totalPriceAfterUpdate - totalDiscountPriceAfterUpdate;

    await cart.save();

    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت حذف شد',
      cart: cart, 
    };
  }

  async applyCoupon(userId: string, couponName: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new HttpException('سبد خرید یافت نشد', 404);
    }

    const coupon = await this.couponModel.findOne({ name: couponName });
    if (!coupon) {
      throw new HttpException('کوپن یافت نشد', 404);
    }
    const isExpired = new Date(coupon.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException('کوپن منقضی شده است', 400);
    }

    const ifCouponAlreadyUsed = cart.coupons.findIndex(coupon => coupon.name === couponName);
    if (ifCouponAlreadyUsed !== -1) {
      throw new HttpException('کوپن قبلاً استفاده شده است', 400);
    }

    if (cart.totalPrice <= 0) {
      throw new HttpException('حداقل مبلغ برای استفاده از کوپن رعایت نشده است', 400);
    }

    cart.coupons.push({name: coupon.name, couponId: coupon._id.toString() });
    cart.totalPrice = cart.totalPrice - coupon.discount;
    await cart.save();
    return {
      statusCode: 200,
      message: 'کوپن با موفقیت اعمال شد',
      cart: cart,
    }
  }

  // ======================= for admin ==========================

  async findOneForAdmin (userId:string){
    const cart = await this.cartModel.findOne({ user: userId })
    .populate('cartItems.productId', 'title price description priceAfterDiscount _id')
    .select('-__v')

    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }
    return{
      statusCode: 200,
      message: 'سبد خرید با موفقیت دریافت شد',
      cart: cart
  }
}

  async findAllForAdmin(){
    const carts = await this.cartModel.find()
    .populate('cartItems.productId', 'title price description priceAfterDiscount _id')
    .select('-__v')
    if (!carts) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }
    return {
      statusCode: 200,
      message: 'سبد خرید ها با موفقیت دریافت شد',
      length: carts.length,
      carts: carts,
    };
  }
}