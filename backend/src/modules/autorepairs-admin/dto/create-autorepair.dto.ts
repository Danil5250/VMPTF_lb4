
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAutorepairDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    adress?: string;

    @IsString()
    @IsOptional()
    index?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    workers_amount?: number;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(5)
    ranking?: number;

    @IsString()
    @IsOptional()
    password?: string;
}
