import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('v1/product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // docs Admin Can Create a Product
  // Route Post /api/v1/product/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد محصول جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateProductDto,
    description: 'محصول با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    createProductDto: CreateProductDto,
  ) {
    return await this.productService.create(createProductDto);
  }

  // docs Admin Can Get All Products
  // Route Get /api/v1/product/all
  // Access public
  @Get('all')
  @ApiOperation({ summary: 'دریافت همه محصولات' })
  @ApiOkResponse({
    type: [CreateProductDto],
    description: 'محصولات با موفقیت دریافت شدند.',
  })
  async findAll(@Query() query) {
    return await this.productService.findAll(query);
  }

  // docs Admin Can Get One Product
  // Route Get /api/v1/product/single/:id
  // Access public
  @Get('single/:id')
  @ApiOperation({ summary: 'دریافت یک محصول' })
  @ApiOkResponse({
    type: CreateProductDto,
    description: 'محصول با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  // docs Admin Can Update a Product
  // Route Put /api/v1/product/update/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی محصول' })
  @ApiCreatedResponse({
    type: UpdateProductDto,
    description: 'محصول با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  // docs Admin Can Delete a Product
  // Route Delete /api/v1/product/delete/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف محصول بدست ادمین' })
  @ApiOkResponse({ description: 'محصول با موفقیت حذف شد.' })
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
