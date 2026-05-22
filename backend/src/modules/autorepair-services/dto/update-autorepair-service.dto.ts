import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateAutorepairServiceDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    service_id?: number;

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    service_price?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    garantie_term?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;
}
