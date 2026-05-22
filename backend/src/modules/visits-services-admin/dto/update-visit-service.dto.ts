import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitServiceDto } from './create-visit-service.dto';

export class UpdateVisitServiceDto extends PartialType(CreateVisitServiceDto) { }
