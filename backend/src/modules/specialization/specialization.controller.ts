import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import { Specialization, SpecializationService } from "./specialization.service";
import { CreateAutorepairSpecializationDto } from "./dto/create-autorepair-specialization.dto";
import { UpdateAutorepairSpecializationDto } from "./dto/update-autorepair-specialization.dto";
import { AutorepairSpecializationResponse } from "./dto/autorepair-specialization-response.dto";

@Controller('specializations')
export class SpecializationController {

    constructor(private readonly service: SpecializationService) { }

    @Get()
    async getAllSpecializations(): Promise<Specialization[]> {
        return await this.service.getAllSpecializations();
    }

    @Post('autorepair')
    async createAutorepairSpecialization(
        @Body() dto: CreateAutorepairSpecializationDto
    ): Promise<AutorepairSpecializationResponse> {
        return await this.service.createAutorepairSpecialization(dto);
    }

    @Get('autorepair/:autorepairId')
    async getAutorepairSpecializations(
        @Param('autorepairId', ParseIntPipe) autorepairId: number
    ): Promise<AutorepairSpecializationResponse[]> {
        return await this.service.getAutorepairSpecializations(autorepairId);
    }

    @Get('allSpecializationsAutorepair')
    async getAllSpecializationsAutorepair() {
        return await this.service.getAllAutorepairSpecializations();
    }

    @Put('autorepair/:id')
    async updateAutorepairSpecialization(
        @Param('id') id: string,
        @Body() dto: UpdateAutorepairSpecializationDto
    ): Promise<AutorepairSpecializationResponse> {
        return await this.service.updateAutorepairSpecialization(+id, dto);
    }

    @Delete('autorepair/:id')
    async deleteAutorepairSpecialization(
        @Param('id') id: string
    ): Promise<void> {
        return await this.service.deleteAutorepairSpecialization(+id);
    }
}