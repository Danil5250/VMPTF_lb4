import { PartialType } from '@nestjs/mapped-types';
import { CreateAutorepairServiceDto } from './create-autorepair-service.dto';

export class UpdateAutorepairServiceDto extends PartialType(CreateAutorepairServiceDto) { }
