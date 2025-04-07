import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from '../auth/guards/Auth.guard';
import {
  GetAllBrandsResponseDto,
  GetOneBrandResponseDto,
  UpdateBrandResponseDto,
} from './dto/brand-response.dto';
import { BrandService } from './brand.service';

@Controller('v1/brand')
@ApiTags('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  // docs Admin Can Create a Brand
  // Route Post /api/v1/brand/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد برند جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateBrandDto,
    description: 'برند با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createBrandDto: CreateBrandDto,
  ) {
    return await this.brandService.create(createBrandDto);
  }

  // docs Admin Can Get All Brands
  // Route Get /api/v1/brand/all
  // Access public
  @Get('all')
  @ApiOperation({ summary: 'دریافت همه برندها' })
  @ApiOkResponse({
    type: GetAllBrandsResponseDto,
    isArray: true,
    description: 'برندها با موفقیت دریافت شدند.',
  })
  async findAll() {
    return await this.brandService.findAll();
  }

  // docs Admin Can Get One Brand
  // Route Get /api/v1/brand/single/:id
  // Access public
  @Get('single/:id')
  @ApiOperation({ summary: 'دریافت یک برند' })
  @ApiOkResponse({
    type: GetOneBrandResponseDto,
    description: 'برند با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.brandService.findOne(id);
  }

  // docs Admin Can Update Brand
  // Route Put /api/v1/brand/update/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی برند' })
  @ApiCreatedResponse({
    type: UpdateBrandResponseDto,
    description: 'برند با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    updateBrandDto: UpdateBrandDto,
  ) {
    return await this.brandService.update(id, updateBrandDto);
  }

  // docs Admin Can Delete Brand
  // Route Delete /api/v1/brand/delete/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف برند' })
  @ApiCreatedResponse({
    type: String,
    description: 'برند با موفقیت حذف شد.',
  })
  async remove(@Param('id') id: string) {
    return await this.brandService.remove(id);
  }
}
