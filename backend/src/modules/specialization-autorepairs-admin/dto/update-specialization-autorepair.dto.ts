
import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecializationAutorepairDto } from './create-specialization-autorepair.dto';

export class UpdateSpecializationAutorepairDto extends PartialType(CreateSpecializationAutorepairDto) { }
