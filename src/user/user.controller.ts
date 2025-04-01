import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/Auth.guard';
import { Roles } from './decorator/Role.decorator';
import {
  GetUserResponseDto,
  GetUsersResponseDto,
  UpdateUserResponseDto,
} from './dto/reaponse-user.dto';

@Controller('v1/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @docs Admin Can Create a User
  // @Route Post /api/v1/user/create
  // @Access private [admin]
  @Post('create')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'ایجاد کاربر جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: 'کاربر با موفقیت ایجاد شد.',
  })
  create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  // @docs Admin Can Get all  Users
  // @Route Get /api/v1/user/all
  // @Access private [admin]
  @Get('all')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'دریافت لیست کاربران برای ادمین' })
  @ApiOkResponse({
    type: GetUsersResponseDto,
    description: 'لیست کاربران با موفقیت برگردانده شد.',
  })
  async findAll(@Query() query) {
    return await this.userService.findAll(query);
  }

  // @docs Admin Can Get Single  Users
  // @Route Get /api/v1/user/single/:id
  // @Access private [admin]
  @Get('single/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'دریافت اطلاعات کاربر برای ادمین' })
  @ApiOkResponse({
    type: GetUserResponseDto,
    description: 'اطلاعات کاربر با موفقیت برگردانده شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  // @docs Admin Can Update Single  Users
  // @Route Put /api/v1/user/update/:id
  // @Access private [admin]
  @Put('update/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'بروزرسانی اطلاعات کاربر برای ادمین' })
  @ApiOkResponse({
    type: UpdateUserResponseDto,
    description: 'پروفایل کاربر با موفقیت بروزرسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  // @docs Admin Can Delete Single  Users
  // @Route Delete /api/v1/user/delete/:id
  // @Access private [admin]
  @ApiOperation({ summary: 'حذف کاربر برای ادمین' })
  @ApiOkResponse({
    description: 'کاربر با موفقیت حذف شد.',
  })
  @Delete('delete/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'حذف کاربر' })
  @ApiOkResponse({ description: 'کاربر با موفقیت حذف شد.' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}

@Controller('v1/user/me')
@ApiTags('me')
export class UsermMeController {
  constructor(private readonly userService: UserService) {}

  // @docs User Can Get data
  // @Route Get /api/v1/user/me
  // @Access private [user, admin]
  @Get()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'دریافت اطلاعات کاربر' })
  @ApiOkResponse({
    type: GetUserResponseDto,
    description: 'اطلاعات کاربر با موفقیت برگردانده شد.',
  })
  async getMe(@Req() req) {
    return await this.userService.findOne(req.user.id);
  }

  // @docs User Can Update data
  // @Route Put /api/v1/user/me/update
  // @Access private [user, admin]
  @ApiOperation({ summary: 'بروزرسانی اطلاعات کاربر' })
  @ApiOkResponse({
    type: [UpdateUserResponseDto],
    description: 'پروفایل کاربر با موفقیت بروزرسانی شد.',
  })
  @Put('update')
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'بروزرسانی اطلاعات کاربر' })
  @ApiOkResponse({
    type: UpdateUserResponseDto,
    description: 'پروفایل کاربر با موفقیت بروزرسانی شد.',
  })
  async updateMe(
    @Req() req,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateMe(req.user, updateUserDto);
  }

  // @docs Any User Can unActive your account
  // @Route Delete /api/v1/user/me/unActive
  // @Access private [user]
  @Delete('unActive')
  @ApiOperation({ summary: 'غیرفعال کردن حساب کاربری' })
  @ApiOkResponse({
    description: 'پروفایل کاربر با موفقیت غیرفعال شد.',
  })
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'پروفایل کاربر با موفقیت حذف شد.' })
  async deleteMe(@Req() req) {
    return await this.userService.deleteMe(req.user);
  }
}
