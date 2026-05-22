import {IsString, IsNumber, IsPositive, Min, MaxLength, Length} from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @Length(1, 100)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    base_price: number;

    @IsNumber()
    @Min(1)
    guarantee_period: number;

    @IsNumber()
    @Min(1)
    average_duration: number;

    @IsNumber()
    @Min(1)
    category_services_id: number;
}
