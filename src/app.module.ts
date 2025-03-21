import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:yphOay8WyBx0X3SacC8EQWfU@annapurna.liara.cloud:32664/ecommerce?authSource=admin',
    ),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
