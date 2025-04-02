import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (category) {
      throw new HttpException('دسته در حال حاضر وجود دارد', 400);
    }
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {
      status: 200,
      message: 'دسته با موفقیت ایجاد شد',
      data: newCategory,
    };
  }

  async findAll() {
    const category = await this.categoryModel.find().select('-__v');
    return {
      status: 200,
      message: 'دسته ها با موفقیت دریافت شدند',
      length: category.length,
      isEmpty: category.length > 0 ? false : true,
      data: category,
    };
  }

  async findOne(_id: string) {
    const category = await this.categoryModel.findOne({ _id }).select('-__v');
    if (!category) {
      throw new NotFoundException('دسته وجود ندارد');
    }
    return {
      status: 200,
      message: 'دسته با موفقیت دریافت شد',
      data: category,
    };
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('دسته وجود ندارد');
    }
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate({ _id }, updateCategoryDto, { new: true })
      .select('-__v');
    return {
      status: 200,
      message: 'دسته با موفقیت بروزرسانی شد',
      data: updatedCategory,
    };
  }

  async remove(_id: string) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('دسته وجود ندارد');
    }
    await this.categoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'دسته با موفقیت حذف شد',
      deletedCategory: category,
    };
  }
}
