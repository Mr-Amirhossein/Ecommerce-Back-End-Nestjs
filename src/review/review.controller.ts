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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from 'src/user/decorator/Role.decorator';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('v1/review')

@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewSrvice:ReviewService ) {}

  // docs User Can Create a Review
  // Route Post /api/v1/review/create
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد نظر جدید' })
  @ApiCreatedResponse({
    type: CreateReviewDto,
    description: 'نظر جدید ایجاد شد',
  })
  async create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    // if(req.user.role.toString() === 'admin') {
    //   throw new UnauthorizedException();
    // }
    const user_id = req.user.id;   
    return await this.reviewSrvice.create(createReviewDto, user_id);
  }

  // docs  Any User Can Get All Review on product
  // Route Get /api/v1/review/all:id
  // Access public
  @Get('all/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت تمام نظرات برای محصول' })
  @ApiOkResponse({
    type: [CreateReviewDto],
    description: 'تمام نظرات برای محصول',
  })
  async findAll(@Param('id') product_id:string) {
    return await this.reviewSrvice.findAll(product_id);
  }


  // docs user Can Update Only Their Review
  // Route Put /api/v1/review/update/:id
  // Access private [admin]
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ویرایش نظر' })
  @ApiOkResponse({
    type: UpdateReviewDto,
    description: 'نظر ویرایش شد',
  })
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const user_id = req.user.id;
    // eslint-disable-next-line
    // @ts-ignore
    return await this.reviewSrvice.update(id, updateReviewDto, user_id);
  }

  // docs user Can Delete Review
  // Route Delete /api/v1/review/delete/:id
  // Access private [user]
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف نظر' })
  @ApiOkResponse({
    description: 'نظر حذف شد',
  })
  async remove(@Param('id') id: string,
  @Req() req
) {
    // if(req.user.role.toString() === 'admin') {
    //   throw new UnauthorizedException();
    // }
    const user_id =req.user.id
    return await this.reviewSrvice.remove(id,user_id);
  }
}

@Controller('v1/dashboard/review')
@ApiTags('Dashboard Review')
export class ReviewdashboardController {
  constructor(private readonly reviewSrvice:ReviewService ) {}
  // docs  Any User Can Get  Reviews on User
  // Route Get /api/v1/review/:id
  // Access private [admin]

  @Get('single/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت یک نظر از طریق کاربر' })
  @ApiOkResponse({
    type: CreateReviewDto,
    description: 'یک نظر از طریق کاربر  ',
  })
  async findOne(@Param('id') user_id: string) {
    return await this.reviewSrvice.findOne(user_id);
  }


}
