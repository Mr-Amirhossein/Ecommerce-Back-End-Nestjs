import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.findOne({
      name: createBrandDto.name,
    });
    if (brand) {
      throw new HttpException('برند با این نام قبلا ایجاد شده است', 400);
    }
    const newBrand = await this.brandModel.create(createBrandDto);

    return {
      statusCode: 200,
      message: 'برند با موفقیت ایجاد شد',
      data: newBrand,
    };
  }

  async findAll() {
    const brands = await this.brandModel.find().select('-__v');

    return {
      statusCode: 200,
      message: 'برندها با موفقیت یافت شدند',
      length: brands.length,
      data: brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('برند یافت نشد');
    }
    return {
      statusCode: 200,
      message: 'برند با موفقیت یافت شد',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('برند یافت نشد');
    }

    const updatedBrand = await this.brandModel.findByIdAndUpdate(
      id,
      updateBrandDto,
      { new: true },
    );

    return {
      statusCode: 200,
      message: 'برند با موفقیت به روز رسانی شد',
      data: updatedBrand,
    };
  }

  async remove(id: string) {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('برند یافت نشد');
    }
    await this.brandModel.findByIdAndDelete(id);
    return {
      statusCode: 200,
      message: 'برند با موفقیت حذف شد',
      deletedBrand: brand,
    };
  }
}
