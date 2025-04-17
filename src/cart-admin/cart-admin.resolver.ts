import { Resolver, Query } from '@nestjs/graphql';
import { CartAdminService } from './cart-admin.service';
import { Cart } from './cart-admin.schema';


@Resolver(() => Cart)
export class CartAdminResolver {
  constructor(private readonly cartAdminService: CartAdminService) {}

  @Query(() => [Cart], { name: 'Cart' })
  findAll() {
    return this.cartAdminService.getCarts();
  }

}
