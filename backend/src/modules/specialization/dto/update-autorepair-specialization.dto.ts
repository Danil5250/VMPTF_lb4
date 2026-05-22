import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAutorepairSpecializationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    specialtion_id?: number;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsString()
    engine_type?: string;

    @IsOptional()
    @IsInt()
    @Min(1890)
    year?: number;
}
