import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Suppliers } from './suppliers.schema';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Suppliers.name) private suppliersModel: Model<Suppliers>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.suppliersModel.findOne({
      name: createSupplierDto.name,
    });
    if (supplier) {
      throw new HttpException('این تامین کننده قبلا ثبت شده است', 400);
    }
    const newSupplier = await this.suppliersModel.create(createSupplierDto);
    return {
      statusCode: 200,
      message: 'تامین کننده با موفقیت ایجاد شد',
      data: newSupplier,
    };
  }

  async findAll() {
    const suppliers = await this.suppliersModel.find().select('-__v');
    return {
      statusCode: 200,
      message: 'تامین کنندگان با موفقیت بازیابی شدند',
      data: suppliers,
    };
  }

  async findOne(id: string) {
    const supplier = await this.suppliersModel.findById(id).select('-__v');
    if (!supplier) {
      throw new HttpException('تامین کننده پیدا نشد', 404);
    }
    return {
      statusCode: 200,
      message: 'تامین کننده با موفقیت بازیابی شد',
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersModel.findById(id);
    if (!supplier) {
      throw new NotFoundException('تامین کننده پیدا نشد');
    }
    const updatedSupplier = await this.suppliersModel
      .findByIdAndUpdate(id, updateSupplierDto, { new: true })
      .select('-__v');
    return {
      statusCode: 200,
      message: 'تامین کننده با موفقیت به روز رسانی شد',
      data: updatedSupplier,
    };
  }

  async remove(id: string) {
    const supplier = await this.suppliersModel.findById(id);
    if (!supplier) {
      throw new NotFoundException('تامین کننده پیدا نشد');
    }
    await this.suppliersModel.deleteOne({ _id: id });
    return {
      statusCode: 200,
      message: 'تامین کننده با موفقیت حذف شد',
      deletedSupplier: supplier,
    };
  }
}
