import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AcceptOrderCashDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';

import * as dotenv from 'dotenv';
import { log } from 'console';
import { MailerService } from '@nestjs-modules/mailer';

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Tax.name) private taxModel: Model<Tax>,
    private readonly mailService: MailerService,

  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string, paymentMethodType: 'cash' | 'card', dataAfterPayment: { success_url: string; cancel_url: string }) {
    const cart = await this.cartModel.findOne({ user: userId })
    .populate('cartItems.productId user', 'title price quantity priceAfterDiscount _id ');
    if (!cart) {
      throw new HttpException('سبد خرید پیدا نشد', 404)
    }
    const tax = await this.taxModel.findOne({});

    // eslint-disable-next-line
    // @ts-ignore
    const shippingAddress = cart.user?.address ? cart.user.address : createOrderDto.shippingAddress;

    if (!shippingAddress) {
      throw new NotFoundException('آدرس پیدا نشد');
    }

    
        const taxPrice = (tax?.taxPrice as unknown as number) || 0;
    const shippingPrice = (tax?.shippingPrice as unknown as number) || 0;
    let data  = {
      user: userId,
      cartItems: cart.cartItems,
      taxPrice,
      shippingPrice,
      totalOrderPrice: cart.totalPrice +  taxPrice + shippingPrice,
      paymentMethodType,
      shippingAddress
    }

    // call the payment gateway here
    
    if (paymentMethodType === 'cash') {
      
      const order = await this.orderModel.create({
        ...data ,
        isPaid: data.totalOrderPrice === 0 ? true : false, 
        paidAt: data.totalOrderPrice === 0 ? new Date() : null, 
        isDelivered: false 
      });
      if (data.totalOrderPrice === 0) {
        cart.cartItems.forEach(async (item) => {
          await this.productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });
        // reset Cart
      }
      await this.cartModel.findOneAndUpdate(
        { user: userId },
        { cartItems: [], totalPrice: 0 },
      );
      
        return {
          statusCode: 201,
          message: 'سفارش با موفقیت ایجاد شد',
          order,
        }
      
    }
    
    const line_items = cart.cartItems.map(({ productId, color  }) => {
      return {
        price_data: {
          currency: 'usd',
          unit_amount: data.totalOrderPrice ,
          product_data: {
            // eslint-disable-next-line
            // @ts-ignore
            name: productId.title,
            // eslint-disable-next-line
            // @ts-ignore
            description: productId.description,
            // eslint-disable-next-line
            // @ts-ignore
            images: [productId.imageCover, ...productId.images || []],
            metadata: {
              color,
            },
          },
        },
        quantity: 1,
      };
    });

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: dataAfterPayment.success_url,
      cancel_url: dataAfterPayment.cancel_url,
      
      client_reference_id: userId.toString(),
      // eslint-disable-next-line
      // @ts-ignore
      customer_email: cart.user.email,
      metadata: {
        address: data.shippingAddress,
      },
    });
    // inser order in db
    const order = await this.orderModel.create({
      ...data,
      sessionId: session.id,
      isPaid: false,
      isDeliverd: false,
    });

    return {
      status: 200,
      message: 'سفارش با موفقیت ایجاد شد',
      data: {
        url: session.url,
        success_url: `${session.success_url}?session_id=${session.id}`,
        cancel_url: session.cancel_url,
        expires_at: new Date(session.expires_at * 1000),
        sessionId: session.id,
        totalPrice: session.amount_total,
        data: order,
      },
    };
  }

  async updatePaidCash(orderId: string, updateOrderDto: AcceptOrderCashDto,) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentMethodType !== 'cash') {
      throw new NotFoundException('This order not paid by cash');
    }

    if (order.isPaid) {
      throw new NotFoundException('Order already paid');
    }

    if (updateOrderDto.isPaid) {
      updateOrderDto.paidAt = new Date();
      const cart = await this.cartModel
        .findOne({ user: order.user.toString() })
        .populate('cartItems.productId user','name email');
      if (!cart) {
        throw new NotFoundException('سبد خرید پیدا نشد');
      }
      cart.cartItems.forEach(async (item) => {
        await this.productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity, sold: item.quantity } },
          { new: true },
        );
      });
      // reset Cart
      await this.cartModel.findOneAndUpdate(
        { user: order.user.toString() },
        { cartItems: [], totalPrice: 0 },
      );

      const htmlMessage = `
    <html>
      <body>
        <h1>Order Confirmation</h1>
        <p>Dear ${(cart?.user as any).name},</p>
        <p>Thank you for your purchase! Your order has been successfully placed and paid for with cash.</p>
        <p>We appreciate your business and hope you enjoy your purchase!</p>
        <p>Best regards,</p>
        <p>The Ecommerce-Nest.JS Team</p>
      </body>
    </html>
    `;

      await this.mailService.sendMail({
        from: `Ecommerce-Nest.JS <${process.env.MAIL_USER}>`,
        // eslint-disable-next-line
        // @ts-ignore
        to: cart.user.email,
        subject: `Ecommerce-Nest.JS - Checkout Order`,
        html: htmlMessage,
      });

    }

    if (updateOrderDto.isDeliverd) {
      updateOrderDto.deliverdAt = new Date();
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { ...updateOrderDto },
      { new: true },
    );

    return {
      status: 200,
      message: 'سفارش با موفقیت پرداخت شد',
      data: updatedOrder,
    };

  }

  async updatePaidCard(payload: any, sig: any, endpointSecret: string) {

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const sessionId = event.data.object.id;

        const order = await this.orderModel.findOne({ sessionId });
        if (!order) {
          throw new NotFoundException('سفارش پیدا نشد');
        }
        order.isPaid = true;
        order.isDelivered = true;
        order.paidAt = new Date();
        order.deliverdAt = new Date();

        const cart = await this.cartModel
          .findOne({ user: order.user.toString() })
          .populate('cartItems.productId user');

        if (!cart) {
          throw new NotFoundException('سبد خرید پیدا نشد');
        }

        cart.cartItems.forEach(async (item) => {
          await this.productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });

        // reset Cart
        await this.cartModel.findOneAndUpdate(
          { user: order.user.toString() },
          { cartItems: [], totalPrice: 0 },
        );

        await order.save();
        await cart.save();

        // send mail
        const htmlMessage = `
    <html>
      <body>
        <h1>Order Confirmation</h1>
        <p>Dear ${(cart.user as any).name},</p>
        <p>Thank you for your purchase! Your order has been successfully placed and paid for with card.♥</p>
        <p>We appreciate your business and hope you enjoy your purchase!</p>
        <p>Best regards,</p>
        <p>The Ecommerce-Nest.JS Team</p>
      </body>
    </html>
    `;

        await this.mailService.sendMail({
          from: `Ecommerce-Nest.JS <${process.env.MAIL_USER}>`,
          // eslint-disable-next-line
          // @ts-ignore
          to: cart.user.email,
          subject: `Ecommerce-Nest.JS - Checkout Order`,
          html: htmlMessage,
        });

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async findAllOrdersOnUser(userId: string) {
    const orders = await this.orderModel.find({ user: userId }).populate('cartItems.productId', 'title price quantity priceAfterDiscount _id'); 
    return {
      status: 200,
      message: 'سفارشات پیدا شد',
      length: orders.length,
      data: orders,
    }
  }


  async findAllOrders() {
    const orders = await this.orderModel.find({});
    return {
      status: 200,
      message: 'Orders found',
      length: orders.length,
      data: orders,
    };
  }

}
