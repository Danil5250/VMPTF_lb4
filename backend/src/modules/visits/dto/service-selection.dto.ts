import {IsString, IsOptional, IsNumber} from 'class-validator';

export class ServiceSelectionDto {
    @IsNumber()
    number: number;

    @IsOptional()
    @IsString()
    note?: string;
}
