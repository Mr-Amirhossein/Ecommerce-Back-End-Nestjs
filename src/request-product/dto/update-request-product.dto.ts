import { PartialType } from '@nestjs/swagger';
import { CreateRequestProductDto } from './create-request-product.dto';

export class UpdateRequestProductDto extends PartialType(CreateRequestProductDto) {}
