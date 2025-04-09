import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController, ReviewdashboardController } from './review.controller';
import { Review, reviewSchema } from './review.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from 'src/product/product.schema';

@Module({
  imports: [
 MongooseModule.forFeature([{ name: Review.name, schema: reviewSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: reviewSchema }]),

  ],
  controllers: [ReviewController, ReviewdashboardController],
  providers: [ReviewService],
})
export class ReviewModule {}
