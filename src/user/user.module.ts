import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UsermMeController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

// For Admin
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, UsermMeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
