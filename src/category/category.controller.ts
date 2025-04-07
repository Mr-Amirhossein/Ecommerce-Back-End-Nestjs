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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  DeleteCategoryResponseDto,
  GetAllCategoresResponseDto,
  GetCategoryResponseDto,
  UpdateCategoryResponseDto,
} from './dto/category-responses.dto';

@Controller('v1/category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // docs Admin Can Create a Category
  // Route Post /api/v1/category/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد دسته جدید بدست ادمین' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'دسته با موفقیت ایجاد شد.',
  })
  create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  // docs Admin and User Can Get all Categories
  // Route Get /api/v1/category/all
  // Access public
  @Get('all')
  @ApiOperation({ summary: 'دریافت همه دسته ها' })
  @ApiCreatedResponse({
    type: GetAllCategoresResponseDto,
    description: 'دسته ها با موفقیت دریافت شدند.',
  })
  async findAll() {
    return await this.categoryService.findAll();
  }

  // docs Admin Can Get a Category
  // Route Get /api/v1/category/single/:id
  // Access public
  @Get('single/:id')
  @ApiOperation({ summary: 'دریافت دسته با شناسه مشخص بدست ادمین' })
  @ApiCreatedResponse({
    type: GetCategoryResponseDto,
    description: 'دسته با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  // docs Admin Can Update a Category
  // Route Patch /api/v1/category/update/:id
  // Access private [admin]

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی دسته با شناسه مشخص بدست ادمین' })
  @ApiCreatedResponse({
    type: UpdateCategoryResponseDto,
    description: 'دسته با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  // docs Admin Can Delete a Category
  // Route Delete /api/v1/category/remove/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('remove/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف دسته با شناسه مشخص بدست ادمین' })
  @ApiCreatedResponse({
    type: DeleteCategoryResponseDto,
    description: 'دسته با موفقیت حذف شد.',
  })
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
