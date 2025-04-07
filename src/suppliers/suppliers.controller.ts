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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('v1/suppliers')
@ApiTags('Suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // docs Admin Can Create a Supplier
  // Route Post /api/v1/suppliers/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد یک تامین کننده' })
  @ApiCreatedResponse({
    type: CreateSupplierDto,
    description: 'تامین کننده با موفقیت ایجاد شد.',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createSupplierDto: CreateSupplierDto,
  ) {
    return await this.suppliersService.create(createSupplierDto);
  }

  // docs Admin Can Get All Suppliers
  // Route Get /api/v1/suppliers/all
  // Access public
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت لیست تامین کنندگان' })
  @ApiOkResponse({
    type: [CreateSupplierDto],
    isArray: true,
    description: 'لیست تامین کنندگان با موفقیت دریافت شد.',
  })
  async findAll() {
    return await this.suppliersService.findAll();
  }

  // docs Admin Can Get One Supplier
  // Route Get /api/v1/suppliers/single/:id
  // Access public
  @Get('single/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت یک تامین کننده' })
  @ApiOkResponse({
    type: CreateSupplierDto,
    description: 'تامین کننده با موفقیت دریافت شد.',
  })
  async findOne(@Param('id') id: string) {
    return await this.suppliersService.findOne(id);
  }

  // docs Admin Can Update Supplier
  // Route Put /api/v1/suppliers/update/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به روز رسانی تامین کننده' })
  @ApiCreatedResponse({
    type: UpdateSupplierDto,
    description: 'تامین کننده با موفقیت به روز رسانی شد.',
  })
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    updateSupplierDto: UpdateSupplierDto,
  ) {
    return await this.suppliersService.update(id, updateSupplierDto);
  }

  // docs Admin Can Delete Supplier
  // Route Delete /api/v1/suppliers/delete/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف تامین کننده' })
  @ApiOkResponse({
    description: 'تامین کننده با موفقیت حذف شد.',
  })
  async remove(@Param('id') id: string) {
    return await this.suppliersService.remove(id);
  }
}
