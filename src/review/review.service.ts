import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/product.schema';

interface newUpdateReviewDto extends UpdateReviewDto {
  user: string;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>

  ) {}
  async create(createReviewDto: CreateReviewDto, user_id: string) {
    const review = await this.reviewModel.findOne({
      user: user_id,
      product: createReviewDto.product,
    });
    if (review) {
      throw new HttpException('شما قبلا برای این محصول review ارسال کرده اید', 400);
    }

    const newReview =await (await this.reviewModel.create({
      ...createReviewDto,
      user: user_id,

    })).populate('product user', 'name email title description imageCover') ;

    const reviewOnSingleProduct = await this.reviewModel.find({product:createReviewDto.product})
    .select('rating')

    const ratingsQuantity = reviewOnSingleProduct.length
    let totalAverage :number= 0;
    for (let i = 0; i < reviewOnSingleProduct.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      totalAverage += reviewOnSingleProduct[i].rating;
    }

    
    const ratingsAverage = totalAverage / ratingsQuantity;

    await this.productModel.findByIdAndUpdate(createReviewDto.product, {
     ratingsAverage,
      ratingsQuantity,
    });
    return {
      status: 200,
      message : 'ایجاد شد. review ',
      data: newReview
    };
  }

  async findAll(product_id:string) {
    const reviews = await this.reviewModel.find({product:product_id})
    .populate('product user', 'name email title')
    .select("-__v")

  if(!reviews.length){
  throw new  NotFoundException("revview یافت نشد")
  }
    return {
      status:200,
      message:'لیست با موفقیت انحام شد review ها',
      length: reviews.length,
      data:reviews
    };
  }

async findOne(user_id: string) {
  const reviews = await this.reviewModel.find({ user:user_id })
    .populate('product user', 'name email title')
    .select("-__v");

  if (!reviews.length) {
    throw new NotFoundException("review یافت نشد")
  }
  return {
    status: 200,
    message: 'لیست review های کاربر با موفقیت دریافت شد',
    length: reviews.length,
    data: reviews
  };
}

  async update(id: string, updateReviewDto: newUpdateReviewDto, user_id: string) {
    const review = await this.reviewModel.findById(id)
    if (!review) {
      throw new NotFoundException("revview یافت نشد")
    }


    
    if (review.user.toString() !== user_id.toString()) {
      throw new UnauthorizedException();
    }
    const updatedReview = await (await this.reviewModel.findByIdAndUpdate( id,{    
       ...updateReviewDto,
       user: user_id,
       product:updateReviewDto.product
       },
       {new:true}
    ).select('-__v'))

    const reviewOnSingleProduct = await this.reviewModel.find({ product: review.product }).select('rating')

    const ratingsQuantity = reviewOnSingleProduct.length
    if (ratingsQuantity > 0) {
       let totalAverage: number = 0;
      for (let i = 0; i < reviewOnSingleProduct.length; i++) {
        totalAverage += reviewOnSingleProduct[i].rating;
      }
    
  
    const ratingsAverage = totalAverage / ratingsQuantity
    
     await this.productModel.findByIdAndUpdate(review.product, {
      ratingsAverage,
      ratingsQuantity,
    });
  }
    return {
      status: 200,
      message: 'review با موفقیت ویرایش شد',
      data: updatedReview,
    };
  }

  async remove(id: string, user_id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('این review وجود ندارد');
    }

    if (review.user.toString() !== user_id.toString()) {
      throw new UnauthorizedException('شما مجاز به حذف این review نیستید');
    }
    
    // First delete the review
    await this.reviewModel.findByIdAndDelete(id);
    
    // Then get the updated review list excluding the deleted one
    const reviewOnSingleProduct = await this.reviewModel.find({ product: review.product }).select('rating')
    
    const ratingsQuantity = reviewOnSingleProduct.length
    
    if(ratingsQuantity > 0){
      let totalAverage: number = 0;
      for (let i = 0; i < reviewOnSingleProduct.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalAverage += reviewOnSingleProduct[i].rating;
      }
      
      const ratingsAverage = totalAverage / ratingsQuantity;
      
      await this.productModel.findByIdAndUpdate(review.product, {
        ratingsAverage,
        ratingsQuantity,
      });
    } else {
      // If there are no more reviews, reset ratings to 0
      await this.productModel.findByIdAndUpdate(review.product, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
    
    return {
      status: 200,
      message: 'review با موفقیت حذف شد',
      deletedReview: review,
      }
  }
}

