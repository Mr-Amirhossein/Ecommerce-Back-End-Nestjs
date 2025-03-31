import { ApiProperty } from '@nestjs/swagger';
export class GetUsersResponseDto {
  @ApiProperty({ example: 'کاربر با موفقیت ایجاد شد.' })
  message: string;
  @ApiProperty({ example: 1 })
  length: number;
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  users: {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class GetUserResponseDto {
  @ApiProperty({ example: 'کاربر با موفقیت ایجاد شد.' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class UpdateUserResponseDto {
  @ApiProperty({ example: 'پروفایل کاربر با موفقیت بروزرسانی شد.' })
  message: string;
  @ApiProperty({
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
