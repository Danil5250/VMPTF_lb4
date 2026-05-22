
import { PartialType } from '@nestjs/mapped-types';
import { CreateAutorepairDto } from './create-autorepair.dto';

export class UpdateAutorepairDto extends PartialType(CreateAutorepairDto) { }
