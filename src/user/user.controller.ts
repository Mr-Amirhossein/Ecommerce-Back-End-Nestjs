import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('single/:id')
  @ApiOkResponse({ description: 'The record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put('update/:id')
  @ApiOkResponse({ description: 'The record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
