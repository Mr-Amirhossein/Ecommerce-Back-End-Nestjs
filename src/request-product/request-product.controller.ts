import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import { log } from 'node:console';
@UseGuards(AuthGuard)
@Controller('v1/request-product')
@ApiTags('RequestProduct')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  // docs User Can Create a Request-Product
  // Route Post /api/v1/request-product/create
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد درخواست محصول جدید بدست کاربر' })
  @ApiCreatedResponse({
    type: CreateRequestProductDto,
    description: 'درخواست محصول جدید با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    createRequestProductDto: CreateRequestProductDto,
    @Req() req,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    return await this.requestProductService.create({
      ...createRequestProductDto,
      user: req.user.id,
    });
  }

  // docs  Admin Can Get All Request-Products
  // Route Get /api/v1/request-product/all
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت تمامی درخواست‌های محصول' })
  @ApiOkResponse({
    type: [CreateRequestProductDto],
    description: 'لیست تمامی درخواست‌های محصول با موفقیت دریافت شد.',
  })
  @ApiOperation({ summary: 'دریافت تمامی درخواست‌های محصول' })
  @ApiCreatedResponse({
    type: [CreateRequestProductDto],
    description: 'لیست تمامی درخواست‌های محصول با موفقیت دریافت شد.',
  })
  async findAll() {
    return await this.requestProductService.findAll();
  }

  // docs  Admin Can Get One Request-Product
  // Route Get /api/v1/request-product/simgle/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get('single/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت یک درخواست محصول' })
  @ApiOkResponse({
    type: CreateRequestProductDto,
    description: 'درخواست محصول با موفقیت دریافت شد.',
  })
  async findOne(
    @Req() req,
    @Param('id') id: string
  ){
    log(req.user);
      return await this.requestProductService.findOne(id, req);
  }

  // docs Users Can Update Request-Product
  // Route Put /api/v1/request-product/update/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی درخواست محصول' })
  @ApiOkResponse({
    type: UpdateRequestProductDto,
    description: 'درخواست محصول با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({forbidNonWhitelisted: true}))
       updateRequestProductDto: UpdateRequestProductDto,
        @Req() req: any,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    return await this.requestProductService.update(id, {...updateRequestProductDto,user: req.user.id});
  }

  // docs Users Can Delete Request-Product
  // Route Delete /api/v1/request-product/delete/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف درخواست محصول' })
  @ApiOkResponse({
    type: CreateRequestProductDto, 
    description: 'درخواست محصول با موفقیت حذف شد.',
  })
  async remove(
    @Param('id') id: string
    , @Req() req,){
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user.id;
    return await this.requestProductService.remove(id,user_id);
  }
}
