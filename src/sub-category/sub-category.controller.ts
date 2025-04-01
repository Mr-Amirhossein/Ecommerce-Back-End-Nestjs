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
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import {
  DeleteSubCategoryResponseDto,
  GetAllSubCategoresResponseDto,
  GetSubCategoryResponseDto,
  UpdateSubCategoryResponseDto,
} from './dto/sub-category-response.dto';

@Controller('v1/sub-category')
@ApiTags('SubCategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  // docs Admin Can Create a SubCategory
  // Route Post /api/v1/sub-category/create
  // Access private [admin]
  @Post('create')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'ایجاد زیر دسته جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateSubCategoryDto,
    description: 'زیر دسته با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return await this.subCategoryService.create(createSubCategoryDto);
  }

  // docs Admin and User Can Get all SubCategories
  // Route Get /api/v1/sub-category/all
  // Access public
  @Get('all')
  @ApiOperation({ summary: 'دریافت همه زیر دسته ها' })
  @ApiCreatedResponse({
    type: GetAllSubCategoresResponseDto,
    description: 'زیر دسته ها با موفقیت دریافت شدند.',
  })
  async findAll() {
    return await this.subCategoryService.findAll();
  }

  // docs Admin Can Get SubCategory by ID
  // Route Get /api/v1/sub-category/single/:id
  // Access public
  @Get('single/:id')
  @ApiOperation({ summary: 'دریافت زیر دسته با شناسه مشخص' })
  @ApiCreatedResponse({
    type: GetSubCategoryResponseDto,
    description: 'زیر دسته با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.subCategoryService.findOne(id);
  }

  // docs Admin Can Update SubCategory by ID
  // Route Put /api/v1/sub-category/update/:id
  // Access private [admin]
  @Put('update/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'به روز رسانی زیر دسته با شناسه مشخص' })
  @ApiCreatedResponse({
    type: UpdateSubCategoryResponseDto,
    description: 'زیر دسته با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return await this.subCategoryService.update(id, updateSubCategoryDto);
  }

  // docs Admin Can Delete SubCategory by ID
  // Route Delete /api/v1/sub-category/delete/:id
  // Access private [admin]
  @Delete('delete/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'حذف زیر دسته با شناسه مشخص' })
  @ApiCreatedResponse({
    type: DeleteSubCategoryResponseDto,
    description: 'زیر دسته با موفقیت حذف شد.',
  })
  async remove(@Param('id') id: string) {
    return await this.subCategoryService.remove(id);
  }
}
