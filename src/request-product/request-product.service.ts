import { HttpException, Injectable } from '@nestjs/common';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct } from './request-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestProductModel: Model<RequestProduct>,
  ) {}
  async create(createRequestProductDto: any) {
    const reqProduct = await this.requestProductModel.findOne({
      titleNeed: createRequestProductDto.titleNeed,
      user: createRequestProductDto.user,
    });
    if (reqProduct) {
      throw new HttpException('این درخواست محصول قبلاً ایجاد شده است', 400);
    }

    const newRequestProduct = await (
      await this.requestProductModel.create({
        ...createRequestProductDto,
      })
    ).populate('user', '-password -__v -role');

    return {
      status: 200,
      message: 'درخواست محصول با موفقیت ایجاد شد',
      data: newRequestProduct,
    };
  }

  async findAll() {
    const requestProducts = await this.requestProductModel
      .find()
      .select('-__v');
    return {
      status: 200,
      message: '  ',
      length: requestProducts.length,
      data: requestProducts,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} requestProduct`;
  }

  update(id: number, updateRequestProductDto: UpdateRequestProductDto) {
    return `This action updates a #${id} requestProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestProduct`;
  }
}
