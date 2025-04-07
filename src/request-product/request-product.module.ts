import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestProduct, requestProductSchema } from './request-product.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProduct.name, schema: requestProductSchema },
      { name: User.name, schema: UserSchema }, // Uncommented the User schema
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
