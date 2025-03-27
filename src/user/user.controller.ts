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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/Auth.guard';
import { Roles } from './decorator/Role.decorator';

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
  @ApiCreatedResponse({
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
  @ApiOkResponse({
    description: 'لیست تمامی کاربران با موفقیت برگردانده شد.',
  })
  async findAll() {
    return await this.userService.findAll();
  }

  // @docs Admin Can Get Single  Users
  // @Route Get /api/v1/user/single/:id
  // @Access private [admin]
  @Get('single/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'کاربر با موفقیت برگردانده شد.' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  // @docs Admin Can Update Single  Users
  // @Route Put /api/v1/user/update/:id
  // @Access private [admin]
  @Put('update/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'کاربر با موفقیت بروزرسانی شد.' })
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
  @Delete('delete/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'کاربر با موفقیت حذف شد.' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
