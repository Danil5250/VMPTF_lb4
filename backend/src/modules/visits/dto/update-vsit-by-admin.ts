import { IsBoolean, IsEnum, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';

export class UpdateVisitByAdminDto {
    @IsOptional()
    @IsISO8601()
    date_time?: string;

    @IsOptional()
    @IsISO8601()
    alternative_date_time?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(['готівка', 'картка'], { message: "payment_way must be 'готівка' or 'картка'" })
    payment_way?: 'готівка' | 'картка';

    @IsOptional()
    @IsEnum(['оплачено', 'не оплачено'], { message: "payment_status must be 'оплачено' or 'не оплачено'" })
    payment_status?: 'оплачено' | 'не оплачено';

    @IsOptional()
    @IsBoolean()
    is_completed?: boolean;

    @IsOptional()
    @IsBoolean()
    is_urgent?: boolean;

    @IsOptional()
    @IsInt()
    car_id?: number;

    @IsOptional()
    @IsInt()
    autorepair_id?: number;
}