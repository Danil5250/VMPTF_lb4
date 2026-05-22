import { IsInt, IsOptional, IsString, Matches, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCarDto {
    @IsString()
    brand: string;

    @IsString()
    model: string;

    @IsOptional()
    @IsString()
    engineType?: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' || value == null ? undefined : Number(value)))
    @IsInt()
    @Min(1886) // first car invented
    @Max(new Date().getFullYear() + 1)
    year?: number;

    @IsOptional()
    @IsString()
    licensePlate?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z0-9]{6,17}$/, { message: 'VIN should be 6-17 alphanumeric' })
    vin?: string;
}
