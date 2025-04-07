import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import { Roles } from 'src/user/decorator/Role.decorator';
@UseGuards(AuthGuard)
@Controller('v1/tax')
@ApiTags('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  
  // docs Admin Can Create a Tax
  // Route Post /api/v1/tax/create
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد مالیات' })
  @ApiCreatedResponse({
    type: CreateTaxDto,
    description:' مالیات با موفقیت ایجاد شد', 
  })
  async create(@Body(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  ) createTaxDto: CreateTaxDto) {
    return await this.taxService.create(createTaxDto);
  }


  // docs Admin Can Get All Tax
  // Route Get /api/v1/tax
  // Access private [admin]
  @Roles(['admin'])
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت   مالیات ' })
  @ApiOkResponse({
    type: CreateTaxDto,
    description:'   مالیات  با موفقیت دریافت شد',
  })
  async find() {
    return await this.taxService.find();
  }


  // docs Admin Can Delete a Tax
  // Route Delete /api/v1/tax/delete/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete('reset')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ریست مالیات' })
  @ApiOkResponse({
    type: UpdateTaxDto,
    description:' مالیات با موفقیت ریست شد',
  })
  async reSet() {
    return await this.taxService.reSet();
  }
}
