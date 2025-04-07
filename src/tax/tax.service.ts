import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(
    @InjectModel(Tax.name)
    private taxModel: Model<Tax>,
  ) {}
  async create(createTaxDto: CreateTaxDto) {
    const tax = await this.taxModel.findOne({});

    if (!tax) {  
      const newTax = await this.taxModel.create(createTaxDto);
      return{
       statusCode: 200,
       message: 'مالیات با موفقیت ایجاد شد',
       data: createTaxDto,
      }
     }

     const updatedTax = await this.taxModel.findOneAndUpdate(
      {},
     createTaxDto ,
      { new: true },
    ).select('-__v');

    if (updatedTax) {
      return {
        statusCode: 200,
        message: 'مالیات با موفقیت بروزرسانی شد',
        data: updatedTax,
      };
    }
  }


  async find() {
    const tax = await this.taxModel.findOne({}).select('-__v');


    return {
      statusCode: 200,
      message: 'لیست تمام مالیات ها با موفقیت دریافت شد',
      data: tax,
    }
  }




  async reSet() {
    await this.taxModel.findOneAndUpdate({},{
      taxPrice: 0,
      shippingPrice: 0,
    })
    return {
      statusCode: 200,
      message: 'مالیات با موفقیت بازنشانی شد',}
  }
}
