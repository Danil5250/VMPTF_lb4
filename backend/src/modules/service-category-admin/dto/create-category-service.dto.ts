import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryServiceDto {
    @IsString()
    @IsNotEmpty()
    category_name: string;
}
