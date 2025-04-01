import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

const saltRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
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

  // @docs Reset Password
  // @Route Post /api/v1/auth/reset-password
  // @Access public
  async resetPassword(email: ResetPasswordDto) {
    const user = await this.userModel
      .findOne({
        email: email.email,
      })
      .select('-__v');
    if (!user) {
      throw new HttpException('کاربر پیدا نشد', 400);
    }

    //Create a  code 6 digit
    const code = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, '0');

    //Update the user with the code
    await this.userModel.findOneAndUpdate(
      { email: email.email },
      { verificationCode: code },
    );
    //Send the code to the user email
    const htmlMessage = `<div>
        <h1>کد بازیابی رمز عبور</h1>
        <p>کد بازیابی شما : <h3 style="color:red; font-weight:bolder; ">${code}</h3></p>
        <p>لطفا این کد را در قسمت مربوطه وارد کنید.</p>
        <p>با تشکر از شما</p>
        <h6 style="font-weight:bold">ecommerce-back-ende تیم پشتیبانی</h6>
        <p>تاریخ : ${new Date().toLocaleDateString('fa-IR')}</p>
      </div>`;
    await this.mailService.sendMail({
      from: `ecommerce-back-end.com <${process.env.MAIL_USER}>`,
      to: email.email,
      subject: 'بازیابی رمز عبور',
      html: htmlMessage,
    });

    return {
      status: 200,
      message: ` کد بازیابی رمز عبور به ایمیل شما ارسال شد به ${email.email}`,
    };
  }

  // @docs Verify Code

  async virifyCode({ email, code }: { email: string; code: string }) {
    const user = await this.userModel
      .findOne({ email })
      .select('+verificationCode');
    if (!user) {
      throw new HttpException('کد تایید نامعتبر است', 400);
    }

    const isMatch = code === user.verificationCode;
    if (!isMatch) {
      throw new UnauthorizedException('کد تایید اشتباه است');
    }
    //Update the user with the code
    await this.userModel.findOneAndUpdate(
      { verificationCode: code },
      { verificationCode: null },
    );

    return {
      status: 200,
      message: 'کد  با موفقیت تایید شد',
    };
  }

  // @docs Change Password
  async changePassword(changePasswordData: SignInDto) {
    const user = await this.userModel.findOne({
      email: changePasswordData.email,
    });
    if (!user) {
      throw new HttpException('کاربر پیدا نشد', 400);
    }

    const password = await bcrypt.hash(changePasswordData.password, saltRounds);
    await this.userModel.findOneAndUpdate(
      { email: changePasswordData.email },
      { password },
    );
    return {
      status: 200,
      message: 'رمز عبور با موفقیت تغییر کرد',
    };
  }
}
