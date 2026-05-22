import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVisitAdminDto {
    @IsInt()
    client_id: number;

    @IsInt()
    car_id: number;

    @IsOptional()
    @IsInt()
    autorepair_id?: number;

    @IsArray()
    services_ids: number[];

    @IsDateString()
    date_time: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsBoolean()
    is_urgent?: boolean;
}
