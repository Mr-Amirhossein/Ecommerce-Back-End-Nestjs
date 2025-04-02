import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}
  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.findOne({
      name: createCouponDto.name,
    });
    if (coupon) {
      throw new HttpException('این کوپن قبلا ایجاد شده است', 400);
    }
    const isExpired = new Date(createCouponDto.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException(
        'تاریخ انقضای کوپن نمیتواند برای گذشته باشد.',
        400,
      );
    }
    const newCoupon = await this.couponModel.create(createCouponDto);

    return {
      statusCode: 200,
      message: 'کوپن با موفقیت ایجاد شد',
      coupon: newCoupon,
    };
  }

  async findAll() {
    const coupons = await this.couponModel.find().select('-__v');
    return {
      statusCode: 200,
      message: 'کوپن ها با موفقیت دریافت شدند',
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('کوپن یافت نشد');
    }

    return {
      statusCode: 200,
      message: 'کوپن با موفقیت دریافت شد',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('کوپن یافت نشد');
    }

    const updatedCoupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'کوپن با موفقیت بروز رسانی شد.',
      data: updatedCoupon,
    };
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('کوپن یافت نشد');
    }

    await this.couponModel.deleteOne({ _id: id });
    return {
      status: 200,
      message: 'کوپن با موفقیت حذف شد.',
      deletedCoupon: coupon,
    };
  }
}
