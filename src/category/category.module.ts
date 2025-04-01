import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from './category.schema';

@Module({
  imports: [
    // Import any modules needed for this module
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
