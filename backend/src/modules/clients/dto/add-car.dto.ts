import { IsString, IsOptional, IsInt, Min, Max, Matches, IsDateString } from 'class-validator';
import {Transform} from "class-transformer";

export class CreateCarDto {
    @IsString()
    brand: string;

    @IsString()
    model: string;

    @IsString()
    engineType: string;

    @IsInt()
    @Min(1890)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @IsDateString()
    @IsOptional()
    insuranceExpiry?: string;

    @IsString()
    @IsOptional()
    @Matches(/^[A-Z0-9-]{3,15}$/i, {
        message: 'licensePlate must contain only letters, digits or "-"',
    })
    licensePlate?: string;

    @IsString()
    @IsOptional()
    vin?: string;
}
