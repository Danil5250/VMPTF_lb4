import { IsString, IsOptional, IsInt, Min, Max, Matches, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    engine_type: string;

    @IsInt()
    @Min(1886)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @IsDateString()
    @IsOptional()
    insurance?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9-]{3,15}$/i, {
        message: 'license_plate must contain only letters, digits or "-"',
    })
    license_plate: string;

    @IsString()
    @IsNotEmpty()
    vin: string;

    @IsInt()
    @IsNotEmpty()
    client_id: number;
}
