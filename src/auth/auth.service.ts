import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './Dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  // @docs  Sign Up
  // @Route Post /api/v1/auth/sign-up
  // @Access public
  async signUp(signUpDto: SignUpDto) {
    const user = await this.userModel.findOne({
      email: signUpDto.email,
    });
    if (user) {
      throw new HttpException('کاربر با این ایمیل قبلا ثبت نام کرده است', 400);
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, saltRounds);
    const userCreate = {
      password: hashedPassword,
      role: 'user',
      active: true,
    };

    const newUser = await this.userModel.create({
      ...signUpDto,
      ...userCreate,
    });
    const payload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      message: 'کاربر با موفقیت ثبت نام شد',
      user: newUser,
      access_Token: token,
    };
  }

  // @docs Sign In
  // @Route Post /api/v1/auth/sign-in
  // @Access public
  async signIn(signInDto: SignInDto) {
    const user = await this.userModel
      .findOne({
        email: signInDto.email,
      })
      .select('-__v');
    if (!user) {
      throw new HttpException('کاربر پیدا نشد', 400);
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('رمز عبور اشتباه است');
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      message: 'ورود با موفقیت انجام شد',
      data: user,
      access_Token: token,
    };
  }
}
