import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './product.schema';
import { SubCategory, subCategorySchema } from 'src/sub-category/sub-category.schema.';
import { Category, categorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: categorySchema }]),
    MongooseModule.forFeature([{ name: SubCategory.name, schema: subCategorySchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
