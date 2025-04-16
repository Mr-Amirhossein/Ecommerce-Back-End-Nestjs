import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Req, Put, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartItemsDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('v1/cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // docs Onlye User logged Can Create a Cart and Add Products to it
  // Route Post /api/v1/cart/:productId
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post(':productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد سبد خرید جدید' })
  @ApiCreatedResponse({
    type: CreateCartDto,
    description: 'سبد خرید با موفقیت ایجاد شد.',
  })
  async create(@Param('productId') productId: string,
  @Req() req, // Use the appropriate type for your request object
) {
  // if (req.user.role.toLowerCase() === 'admin') {
  //   throw new UnauthorizedException();
  // }
  const userId = req.user.id; // Assuming the user ID is stored in req.user._id  
  return await this.cartService.create(productId, userId);
  }

  // docs Get All Cart
  // Route Get /api/v1/cart
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت همه سبد خریدها' })
  @ApiOkResponse({
    type: CreateCartDto,
    description: 'سبد خریدها با موفقیت دریافت شد.',
  })
  async findAll() {
    return await this.cartService.findAll();
  }

  // docs Get One Cart
  // Route Get /api/v1/cart/single/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Get('single/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت سبد خرید' })
  @ApiOkResponse({
    type: CreateCartDto,
    description: 'سبد خرید با موفقیت دریافت شد.',
  })
  async findOne(@Req() req) {
    const userId = req.user.id; // Assuming the user ID is stored in req.user._id
    return await this.cartService.findOne(userId);
  }

  // docs Admin Can Update a Cart
  // Route Put /api/v1/cart/update/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard) 
  @Put('update/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی سبد خرید' })
  @ApiCreatedResponse({
    type: UpdateCartItemsDto,
    description: 'سبد خرید با موفقیت به روز رسانی شد.',
  })  
  async update(@Param('productId') productId: string, @Body(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    })) updateCartItemsDto: UpdateCartItemsDto,
   @Req() req // Use the appropriate type for your request object
) {
    // if (req.user.role.toLowerCase() === 'admin') {
    //   throw new UnauthorizedException();
    // }
    const userId = req.user.id; // Assuming the user ID is stored in req.user._id
    
    return await this.cartService.update(productId, updateCartItemsDto, userId);
  }

  // docs Admin Can Delete a Cart
  // Route Delete /api/v1/cart/delete/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete('delete/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف سبد خرید بدست کاربر' })
  @ApiOkResponse({
    type: CreateCartDto,
    description: 'سبد خرید با موفقیت حذف شد.',
  })
  async remove(@Param('productId') productId: string,
    @Req() req
  ) {
    const userId = req.user.id; // Assuming the user ID is stored in req.user._id
    return await this.cartService.remove(productId , userId);

  }
  // docs User Can Apply Coupons
  // Route Put /api/v1/cart/apply-coupons/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Put('apply-coupons/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'اعمال کد تخفیف' })
  @ApiCreatedResponse({
    type: CreateCartDto,
    description: 'کد تخفیف با موفقیت اعمال شد.',
  })

  async applayCoupons(@Param('id') id: string, @Body(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  
  ) coupons: string[]) {
    return await this.cartService.applyCoupons(id, coupons);
  }

}
