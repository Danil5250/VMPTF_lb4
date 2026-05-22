import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Service, AutorepairServicesService } from "./autorepair-services.service";
import { CreateAutorepairServiceDto } from "./dto/create-autorepair-service.dto";
import { UpdateAutorepairServiceDto } from "./dto/update-autorepair-service.dto";
import { AutorepairServiceResponse } from "./dto/autorepair-service-response.dto";

@Controller('autorepair-services')
export class AutorepairServicesController {

    constructor(private readonly service: AutorepairServicesService) { }

    @Get()
    async getAllServices(): Promise<Service[]> {
        return await this.service.getAllServices();
    }

    @Post('autorepair')
    async createAutorepairService(
        @Body() dto: CreateAutorepairServiceDto
    ): Promise<AutorepairServiceResponse> {
        return await this.service.createAutorepairService(dto);
    }

    @Get('autorepair/:autorepairId')
    async getAutorepairServices(
        @Param('autorepairId', ParseIntPipe) autorepairId: number
    ): Promise<AutorepairServiceResponse[]> {
        return await this.service.getAutorepairServices(autorepairId);
    }

    @Put('autorepair/:id')
    async updateAutorepairService(
        @Param('id') id: string,
        @Body() dto: UpdateAutorepairServiceDto
    ): Promise<AutorepairServiceResponse> {
        return await this.service.updateAutorepairService(+id, dto);
    }

    @Delete('autorepair/:id')
    async deleteAutorepairService(
        @Param('id') id: string
    ): Promise<void> {
        return await this.service.deleteAutorepairService(+id);
    }
}
