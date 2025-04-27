import { Controller, Get, Post, Body, Param, Delete, UseGuards, ValidationPipe, Put, Req, NotFoundException, Query, Headers, RawBodyRequest } from '@nestjs/common';
import { OrderService } from './order.service';
import { AcceptOrderCashDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';

@Controller('v1/order/checkout')
@ApiTags('Order/Checkout')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // docs User Can Create a Order
  // Route Post /api/v1/order/create
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post(':paymentMethodType')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد سفارش جدید بدست کاربر' })
  @ApiCreatedResponse({
    type: CreateOrderDto,
    description: 'سفارش با موفقیت ایجاد شد.',
  })
  async create(
    @Param('paymentMethodType') paymentMethodType: 'cash' | 'card',
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    createOrderDto: CreateOrderDto,
    @Req() req,
    @Query() query,
  ) {
    // if (req.user.role.toLowerCase() === 'admin') {
    //   throw new UnauthorizedException();
    // }

    
    if(!['cash', 'card'].includes(paymentMethodType) ) {
      throw new NotFoundException('روش پرداخت نامعتبر است');
    }

    const { success_url = 'https://ecmmerce.com', cancel_url = 'https://ecmmerce.com' } = query;

    const dataAfterPayment = {
      success_url,
      cancel_url,
    }
    const userId = req.user.id;
    return await this.orderService.create(createOrderDto, userId, paymentMethodType, dataAfterPayment);
  }

  //  @docs   Admin Can Update Order payment cash
  //  @Route  PATCH /api/v1/cart/checkout/:orderId/cash
  //  @access Private [User]
  @Put(':orderId/cash')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  updatePaidCash(
    @Param('orderId') orderId: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateOrderDto: AcceptOrderCashDto,
  ) {
  return  this.orderService.updatePaidCash(orderId, updateOrderDto);

  }
}



@Controller('v1/checkout/session')
@ApiTags('checkout/session')
export class CheckoutSessionController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   Webhook paid order true auto
  //  @Route  PATCH /api/v1/checkout/session
  //  @access Private [Stripe]
  @Post()
  updatePaidCard(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const endpointSecret =
      'whsec_db59966519a65529ae568ade70303bf419be37a47f3777c18a8a4f1c79c8a07a';

    const payload = request.rawBody;

    return this.orderService.updatePaidCard(payload, sig, endpointSecret);
  }

}


@Controller('v1/order/user')
@ApiTags('Order/User')
export class OrderUserController {
  constructor(private readonly orderService: OrderService) {}

  // docs User Can Get All Orders
  // Route Get /api/v1/order/
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت همه سفارشات' })
  @ApiCreatedResponse({
    type: CreateOrderDto,
    description: 'سفارشات با موفقیت دریافت شد.',
  })
   async findAll(@Req() req) {
    const userId = req.user.id;
    return await this.orderService.findAllOrdersOnUser(userId);
  }
}


@Controller('v1/order/admin')
@ApiTags('Order/Admin')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}
  //  @docs   Admin Can get all order
  //  @Route  GET /api/v1/order/admin
  //  @access Private [Admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAllOrders() {
    return this.orderService.findAllOrders();
  }
  //  @docs   Admin Can get all order
  //  @Route  GET /api/v1/order/admin/:userId
  //  @access Private [Admin]
  @Get(':userId')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAllOrdersByUserId(@Param('userId') userId: string) {
    return this.orderService.findAllOrdersOnUser(userId);
  }
  }  