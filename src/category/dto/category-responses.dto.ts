import { ApiProperty } from '@nestjs/swagger';

export class GetAllCategoresResponseDto {
  @ApiProperty({ example: 'دسته ها با موفقیت دریافت شدند.' })
  message: string;
  @ApiProperty({ example: 1 })
  length: number;
  @ApiProperty({
    example: [
      {
        id: '1',
        name: 'دسته اول',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  categories: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class GetCategoryResponseDto {
  @ApiProperty({ example: 'دسته با موفقیت دریافت شد.' })
  message: string;
  @ApiProperty({
    example: {
      id: '1',
      name: 'دسته اول',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class UpdateCategoryResponseDto {
  @ApiProperty({ example: 'دسته با موفقیت بروزرسانی شد.' })
  message: string;
  @ApiProperty({
    example: {
      id: '1',
      name: 'دسته اول',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class DeleteCategoryResponseDto {
  @ApiProperty({ example: 'دسته با موفقیت حذف شد.' })
  message: string;
  @ApiProperty({
    example: {
      id: '1',
      name: 'دسته اول',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  deletedCategory: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
