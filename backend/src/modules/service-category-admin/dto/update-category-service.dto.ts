import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryServiceDto } from './create-category-service.dto';

export class UpdateCategoryServiceDto extends PartialType(CreateCategoryServiceDto) { }
