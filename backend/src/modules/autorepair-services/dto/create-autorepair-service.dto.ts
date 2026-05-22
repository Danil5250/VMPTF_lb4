import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAutorepairServiceDto {
    @IsInt()
    @Min(1)
    autorepair_id: number;

    @IsInt()
    @Min(1)
    service_id: number;

    @IsNumber()
    @Min(0.01)
    service_price: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    garantie_term?: number;

    @IsInt()
    @Min(1)
    duration: number;
}
