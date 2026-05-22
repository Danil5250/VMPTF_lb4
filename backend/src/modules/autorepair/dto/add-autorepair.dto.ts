import {IsInt, IsOptional, IsPositive, IsString, Length} from "class-validator";

export class CreateAutorepairDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    adress?: string;

    @IsOptional()
    @IsString()
    @Length(1, 20)
    index?: string;

    @IsInt()
    @IsPositive()
    workers_amount?: number;
    phone?: string;
    email?: string;
    ranking?: number;
    password: string;
}
