import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema.';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });
    if (subCategory) {
      throw new HttpException('این زیر دسته قبلا ایجاد شده است', 400);
    }

    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );

    if (!category) {
      throw new NotFoundException('دسته وجود ندارد');
    }

    const newSubCategory = await (
      await this.subCategoryModel.create(createSubCategoryDto)
    ).populate('category', '-_id -__v -image');
    console.log(newSubCategory);

    return {
      status: 200,
      message: 'زیر دسته با موفقیت ایجاد شد',
      data: newSubCategory,
    };
  }

  async findAll() {
    const subCategories = await this.subCategoryModel
      .find()
      .select('-__v -image')
      .populate('category', '-_id -__v -image');
    return {
      status: 200,
      message: 'زیر دسته ها با موفقیت پیدا شدند',
      length: subCategories.length,
      isEmpty: subCategories.length > 0 ? false : true,
      data: subCategories,
    };
  }

  async findOne(_id: string) {
    const subCategory = await this.subCategoryModel
      .findOne({ _id })
      .select('-__v')
      .populate('category', '-_id -__v -image');

    if (!subCategory) {
      throw new NotFoundException('این زیر دسته پیدا نشد');
    }
    return {
      status: 200,
      message: 'زیر دسته با موفقیت پیدا شد',
      data: subCategory,
    };
  }

  async update(_id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('این زیر دسته پیدا نشد');
    }

    const updatedSubCategory = await this.subCategoryModel
      .findByIdAndUpdate(_id, updateSubCategoryDto, { new: true })
      .select('-__v')
      .populate('category', '-_id -__v -image');
    return {
      status: 200,
      message: 'زیر دسته با موفقیت به روز رسانی شد',
      data: updatedSubCategory,
    };
  }

  async remove(_id: string) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('این زیر دسته پیدا نشد');
    }
    await this.subCategoryModel.findByIdAndDelete(_id);
    return {
      status: 200,
      message: 'زیر دسته با موفقیت حذف شد',
      deletedSub: subCategory,
    };
  }
}
