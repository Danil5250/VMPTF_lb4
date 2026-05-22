import {IsNotEmpty, IsString, Length, MinLength} from "class-validator";

export class ClientLoginDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    login:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password:string;
}