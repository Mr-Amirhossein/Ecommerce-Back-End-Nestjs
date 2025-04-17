import { CreateCartAdminInput } from './create-cart-admin.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCartAdminInput extends PartialType(CreateCartAdminInput) {
  id: number;
}
