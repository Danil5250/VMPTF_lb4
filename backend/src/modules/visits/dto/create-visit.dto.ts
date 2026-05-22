import {Transform, Type} from 'class-transformer';
import {
    ValidateNested,
    IsOptional,
    IsArray,
    IsDateString,
    IsString,
    Validate,
    IsInt,
    Min,
    Max,
    Matches, Length, IsEmail, IsBoolean
} from 'class-validator';
import { CreateCarDto } from './create-car.dto';
import { CreateClientDto } from '../../clients/dto/add-client.dto';
import { ServiceSelectionDto } from './service-selection.dto';
import {SelectedServicesValidator} from "../../shared/validators/SelectedServicesValidator";

export class CreateVisitDto {
    // @ValidateNested()
    // @Type(() => CreateCarDto)
    // carData: CreateCarDto;

    @IsString()
    car_brand: string;

    @IsString()
    car_model: string;

    @IsOptional()
    @IsString()
    car_engineType?: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' || value == null ? undefined : Number(value)))
    @IsInt()
    @Min(1886) // first car invented
    @Max(new Date().getFullYear() + 1)
    car_year?: number;

    @IsString()
    car_licensePlate: string;

    @IsString()
    @Matches(/^[A-Za-z0-9]{6,17}$/, { message: 'VIN should be 6-17 alphanumeric' })
    car_vin?: string;


    // @ValidateNested()
    // @Type(() => CreateClientDto)
    // personalData: CreateClientDto;

    @IsString()
    @Length(1, 255)
    client_name: string;

    @IsString()
    @Length(1, 255)
    client_surname?: string;

    @IsOptional()
    @IsString()
    @Length(0, 255)
    client_middlename?: string;

    @IsEmail()
    client_email: string;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    client_phone?: string;

    @IsOptional()
    @IsString()
    @Length(0, 100)
    client_login?: string;

    @IsOptional()
    @IsString()
    @Length(0, 100)
    client_password?: string;

    @IsOptional()
    @IsDateString()
    visit_selectedDate?: string | null;

    @IsOptional()
    @IsDateString()
    visit_selectedAlternativeDate?: string | null;

    @IsOptional()
    @IsString()
    visit_note?: string | null;

    @IsOptional()
    @IsString()
    visit_paymentWay?: string | null;

    @IsOptional()
    @IsString()
    visit_paymentStatus?: string | null;

    @IsOptional()
    @IsString()
    visit_isCompleted?: string | null;

    @IsOptional()
    @IsString()
    visit_carid?: string | null;

    @IsOptional()
    @IsBoolean()
    is_urgent?: boolean | null;

    @IsOptional()
    @IsString()
    visit_autorepairId?: string | null;

    @IsOptional()
    @Validate(SelectedServicesValidator)
    visit_selectedServices: string | number[];
}
