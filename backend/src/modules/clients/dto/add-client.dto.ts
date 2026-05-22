import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDto {
    @IsString()
    @Length(1, 255)
    name?: string;

    @IsString()
    @Length(1, 255)
    surname?: string;

    @IsOptional()
    @IsString()
    @Length(0, 255)
    middlename?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(0, 100)
    login?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
