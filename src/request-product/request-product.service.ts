import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct } from './request-product.schema';
import { Model } from 'mongoose';
import { CreateRequestProductDto } from './dto/create-request-product.dto';


interface NewUpdateRequestProductDto extends UpdateRequestProductDto {
  user:string
}

interface NewCreateRequestProductDto extends CreateRequestProductDto {
  user:string
}



@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestProductModel: Model<RequestProduct>,
  ) {}
  async create(createRequestProductDto: NewCreateRequestProductDto) {
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
      message: 'درخواست محصولات با موفقیت دریافت شد',
      length: requestProducts.length,
      data: requestProducts,
    };
  }

  async findOne(id: string, req: any) {
    const requestProduct = await this.requestProductModel.findById(id)
    .select('-__v')
    .populate('user', '-password -__v -role');
    
    if 
    (!requestProduct) {
      throw new NotFoundException('درخواست محصول یافت نشد');
    }
    console.log(req);
    
    if (req.user.id.toString() !== requestProduct.user._id.toString() && req.user.role.toLowerCase() !== 'admin' ) {
    throw new UnauthorizedException()
  }
    return {
      status: 200,
      message: 'درخواست محصول با موفقیت دریافت شد',
      data: requestProduct,
    };
  }

  async update(id: string,updateRequestProductDto: NewUpdateRequestProductDto) {
    const requestProduct = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-password -__v -role');

    if (!requestProduct) {
      throw new NotFoundException('درخواست محصول یافت نشد');
    }

    if (requestProduct.user._id.toString() !== updateRequestProductDto.user.toString()){
      throw new UnauthorizedException('شما مجاز به ویرایش این درخواست محصول نیستید');
    }

    const updatedRequestProduct = await this.requestProductModel.findByIdAndUpdate(
      id,
      updateRequestProductDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'درخواست محصول با موفقیت ویرایش شد',
      data: updatedRequestProduct,
    }
  }

  async remove(requestProduct_id: string,user_id: string) {
    const requestProduct = await this.requestProductModel.findById(requestProduct_id)
    .select('-__v')
    .populate('user', '-password -__v -role');
    if (!requestProduct) {
      throw new HttpException('این درخواست محصول در حال حاظر موجود است ', 404);
    }
    if (requestProduct.user._id.toString() !== user_id.toString()){
      throw new UnauthorizedException('شما مجاز به حذف این درخواست محصول نیستید');
    }
    await this.requestProductModel.findByIdAndDelete(requestProduct_id);

    return{
      status: 200,
      message: 'درخواست محصول با موفقیت حذف شد',
      data: requestProduct,
    };
  }
}
