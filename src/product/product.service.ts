import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOne({
      title: createProductDto.title,
    }).select('-__v ');

    const category = await this.productModel.findById({
      _id: createProductDto.category,
    }).select('-__v');
    if (!category) {
      throw new NotFoundException('دسته بندی یافت نشد');
    }
    if (product) {
       throw new HttpException('این محصول قبلا ایجاد شده است', 400,)
    }
    const newProduct = await( await this.productModel.create(createProductDto)).populate('category subCategory brand','-__v');

    return{
      status: 201,
      message: 'محصول با موفقیت ایجاد شد',
      data: newProduct,
    }
  }

  async findAll(query:any) {
    let requestQuery = {...query}
    const removeQuery =['page','limit','sort','keyword','category','fields']
    removeQuery.forEach((singleQuery) =>{
      delete requestQuery[singleQuery]
    })

    requestQuery = JSON.parse(JSON.stringify(requestQuery).replace(
      /\b(gte|lte|lt|gt)\b/g,
      (match) => `$${match}`,
    ))
    
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page - 1) * limit;

    let sort = query?.sort || 'title';
    sort = sort.split(',').join(' ');
    if(!['asc','desc'].includes(sort)){
     throw new HttpException('فقط می توانید از sort:asc و sort:desc استفاده کنید', 400)
    }
   
    let fields = query?.fields || '';
    fields = fields.split(',').join(' ');


    let findData = { ...requestQuery};

    if(query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword} },
      ];
    }
    if(query.category) {
      findData.category = query.category.toString();
    }
    const products = await this.productModel.find().limit(limit).skip(skip).sort({title:sort}).select(fields);

    if (!products) {
      throw new NotFoundException('محصولی یافت نشد');
    }

    return{
      status: 200,
      message: 'محصولات با موفقیت دریافت شدند',
      length: products.length,
      isEmpty: products.length > 0 ? false : true,

      data: products,
    };
  }

  async findOne(id: string) {
 
    const product = await this.productModel.findById(id)
    .select('-__v')
    .populate('category subCategory brand','-__v');
    if (!product) {
      throw new NotFoundException('محصولی یافت نشد');
    }
    return {
      status: 200,
      message: 'محصول با موفقیت دریافت شد',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id).select('-__v');

    if (!product) {
      throw new NotFoundException('محصولی یافت نشد');
    }
    if (updateProductDto.category) {
      const category = await this.productModel.findById({
        _id: updateProductDto.category,
      }).select('-__v');
      if (!category) {
        throw new NotFoundException('دسته بندی یافت نشد');
      }
    }

    if(updateProductDto.subCategory){
      const subCategory = await this.productModel.findById({
        _id: updateProductDto.subCategory,
      }).select('-__v');
      if (!subCategory) {
        throw new NotFoundException('زیر دسته بندی یافت نشد');
      }
    }


    if(updateProductDto.sold !== undefined && product.quantity < updateProductDto.sold){
      throw new HttpException('تعداد فروش بیشتر از موجودی است', 400)
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto ,
      { new: true },
    ).populate('category subCategory brand','-__v');

    return{
      status: 200,
      message: 'محصول با موفقیت ویرایش شد',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id).select('-__v');
    if (!product) {
      throw new NotFoundException('محصولی یافت نشد');
    }
    await this.productModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'محصول با موفقیت حذف شد',
      deletedProduct: product,
    };
  }
}
