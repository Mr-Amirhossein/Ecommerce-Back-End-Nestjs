import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('v1/coupon')
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // docs Admin Can Create a Coupon
  // Route Post /api/v1/coupon/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد کوپن جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateCouponDto,
    description: 'کوپن با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createCouponDto: CreateCouponDto,
  ) {
    return await this.couponService.create(createCouponDto);
  }

  // docs Admin Can Get All Coupons
  // Route Get /api/v1/coupon/all
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت همه کوپن ها' })
  @ApiOkResponse({
    type: [CreateCouponDto],
    description: 'کوپن ها با موفقیت دریافت شدند.',
  })
  async findAll() {
    return await this.couponService.findAll();
  }

  // docs Admin Can Get One Coupon
  // Route Get /api/v1/coupon/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get('single/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت یک کوپن' })
  @ApiOkResponse({
    type: CreateCouponDto,
    description: 'کوپن با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.couponService.findOne(id);
  }

  // docs Admin Can Update Coupon
  // Route Put /api/v1/coupon/update/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی کوپن بدست ادمین' })
  @ApiOkResponse({
    type: UpdateCouponDto,
    description: 'کوپن با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    updateCouponDto: UpdateCouponDto,
  ) {
    return await this.couponService.update(id, updateCouponDto);
  }

  // docs Admin Can Delete Coupon
  // Route Delete /api/v1/coupon/delete/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف کوپن بدست ادمین' })
  @ApiOkResponse({
    description: 'کوپن با موفقیت حذف شد.',
  })
  async remove(@Param('id') id: string) {
    return await this.couponService.remove(id);
  }
}
