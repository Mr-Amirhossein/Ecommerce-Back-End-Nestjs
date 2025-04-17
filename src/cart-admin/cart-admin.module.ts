import { Module } from '@nestjs/common';
import { CartAdminResolver } from './cart-admin.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from './cart-admin.schema';
import { CartAdminService } from './cart-admin.service';

@Module({
  imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }) ,

   ],
  providers: [CartAdminResolver,CartAdminService],
})
export class CartAdminModule {}
