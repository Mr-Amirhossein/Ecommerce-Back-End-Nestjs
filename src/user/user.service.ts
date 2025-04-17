import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // For Admin
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    //چک کردن اینکه ایمیل وارد شده تکراری نباشد
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new HttpException('کاربری با این ایمیل وجود دارد.', 400);
    }

    // ایجاد یک کاربر جدید

    const newUser = {
      password: hashedPassword,
      role: createUserDto.role ?? 'user',
      active: true,
    };
    return {
      status: 200,
      message: 'کاربر با موفقیت ایجاد شد.',
      data: await this.userModel.create({ ...createUserDto, ...newUser }),
    };
  }

  //Pagination
  async findAll() {
    // const { limit = 1000_000_000, skip = 0, sort, name, email, role } = query;

    // // or=> کجاست همراه  با تمام فیلد ها جستجو
    // //  rege=> جستجو با هر کدام از فیلد ها
    // const users = await this.userModel
    //   .find()
    //   .skip(skip)
    //   .limit(limit)
    //   .where('name', new RegExp(name, 'i'))
    //   .where('email', new RegExp(email, 'i'))
    //   .where('role', new RegExp(role, 'i'))
    //   .where('active', true)
    //   .sort({ name: sort })
    //   .select('-password -__v');

    // if (Number.isNaN(Number(limit))) {
    //   throw new HttpException('مقدار limit باید عدد باشد.', 400);
    // }

    // if (Number.isNaN(Number(skip))) {
    //   throw new HttpException('مقدار skip باید عدد باشد.', 400);
    // }

    // if (!['asc', 'desc'].includes(sort)) {
    //   throw new HttpException('مقدار sort باید asc یا desc باشد.', 400);
    // }

    // // برگرداندن تمامی کاربران

    const users = await this.userModel
      .find()
      .select('-__v');
    return {
      status: 200,
      message: 'کاربران با موفقیت برگردانده شدند.',
      length: users.length,
      data: users,
    };
  }

  async findOne(
    id: string,
  ): Promise<{ status: number; message: string; data: User }> {
    const user = await this.userModel.findById(id).select('-password -__v');
    // چک کردن اینکه کاربر وجود داشته باشد
    if (!user) {
      throw new HttpException('کاربری با این مشخصات وجود ندارد.', 404);
    }
    // برگرداندن یک کاربر با استفاده از شناسه
    return {
      status: 200,
      message: 'کاربر با موفقیت برگردانده شد.',
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    const userExist = await this.userModel
      .findById(id)
      .select('-password -__v');
    // چک کردن اینکه کاربر وجود داشته باشد
    if (!userExist) {
      throw new HttpException('کاربری با این مشخصات وجود ندارد.', 404);
    }
    let user = { ...updateUserDto };
    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, saltRounds);
      user = {
        ...user,
        password,
      };
    }
    // برگرداندن پیام و کاربر به روز شده
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!updatedUser) {
      throw new HttpException('به روزرسانی کاربر با خطا مواجه شد.', 500);
    }

    return {
      status: 200,
      message: 'کاربر با موفقیت به روز رسانی شد.',
      data: updatedUser,
    };
  }

  async remove(id: string): Promise<{ status: number; message: string }> {
    const user = await this.userModel.findById(id).select('-password -__v');
    // چک کردن اینکه کاربر وجود داشته باشد
    if (!user) {
      throw new HttpException('کاربری با این مشخصات وجود ندارد.', 404);
    }
    // حذف کاربر با استفاده از شناسه
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'کاربر با موفقیت حذف شد.',
    };
  }

  //======================================= For User ===========================================

  // @docs User Can Get data
  async getMe(
    payload,
  ): Promise<{ status: number; message: string; data: User }> {
    if (!payload.id) {
      throw new NotFoundException('کاربری با این مشخصات وجود ندارد.');
    }

    const user = await this.userModel
      .findById(payload.id)
      .select('-password -__v');
    // چک کردن اینکه کاربر وجود داشته باشد.
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات وجود ندارد.');
    }
    // برگرداندن یک کاربر با استفاده از شناسه
    return {
      status: 200,
      message: 'کاربر با موفقیت برگردانده شد.',
      data: user,
    };
  }

  // @docs User Can Update data
  async updateMe(
    payload,
    updateUserDto: UpdateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    const user = await this.userModel.findById(payload.id);
    // چک کردن اینکه کاربر وجود داشته باشد
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات وجود ندارد.');
    }
    let userData = { ...updateUserDto };

    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, saltRounds);
      userData = {
        ...userData,
        password,
      };
    }
    // برگرداندن پیام و کاربر به روز شده
    const updatedUser = await this.userModel
      .findByIdAndUpdate(payload.id, userData, {
        new: true,
      })
      .select('-password -__v');

    if (!updatedUser) {
      throw new NotFoundException('به روزرسانی کاربر با خطا مواجه شد.');
    }

    return {
      status: 200,
      message: 'کاربر با موفقیت به روز رسانی شد.',
      data: updatedUser,
    };
  }

  // @docs Any User Can unActive your account
  async deleteMe(payload): Promise<void> {
    if (!payload.id) {
      throw new NotFoundException('کاربری با این مشخصات وجود ندارد.');
    }
    // چک کردن اینکه کاربر وجود داشته باشد
    const user = await this.userModel
      .findById(payload.id)
      .select('-password -__v');

    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات وجود ندارد.');
    }
    await this.userModel.findByIdAndUpdate(
      payload.id,
      { active: false },
      { new: true },
    );
  }
}
