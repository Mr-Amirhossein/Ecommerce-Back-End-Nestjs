import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from './auth.dto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
