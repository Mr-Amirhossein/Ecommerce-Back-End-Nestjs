import { HttpException, Injectable } from '@nestjs/common';
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
  async findAll(): Promise<{ status: number; message: string; data: User[] }> {
    // برگرداندن تمامی کاربران
    return {
      status: 200,
      message: 'کاربران با موفقیت برگردانده شدند.',
      data: await this.userModel.find().select('-password -__v'),
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
}
