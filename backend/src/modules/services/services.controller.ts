import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Redirect, Render } from "@nestjs/common";
import { AppService } from "../../app.service";
import { RetrieveServiceOptions, ServicesService } from "./services.service";
import { CreateServiceDto } from "./add-service.dto";

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }



    @Get()
    async getFilteredServices(
        @Query("search") search?: string,
        @Query("category") category?: string,
        @Query("minPrice") minPrice?: string,
        @Query("maxPrice") maxPrice?: string,
        @Query("minWarranty") minWarranty?: string,
        @Query("maxWarranty") maxWarranty?: string,
        @Query("minDuration") minDuration?: string,
        @Query("maxDuration") maxDuration?: string,
        @Query("sortBy") sortBy?: 'name' | 'basePrice' | 'duration' | 'warranty',
        @Query("sortOrder") sortOrder: 'ASC' | 'DESC' = 'ASC',
        @Query("limit") limit?: string,
        @Query('offset') offset?: string,
    ) {
        const options: Partial<RetrieveServiceOptions> = {
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minWarranty: minWarranty ? parseInt(minWarranty) : undefined,
            maxWarranty: maxWarranty ? parseInt(maxWarranty) : undefined,
            minDuration: minDuration ? parseFloat(minDuration) : undefined,
            maxDuration: maxDuration ? parseFloat(maxDuration) : undefined,
            sortBy,
            sortOrder,
            limit,
            offset
        };

        return await this.servicesService.getServices(options);
    }


    @Get("allClientStatistics")
    async getAllClientsStatistics() {
        return await this.servicesService.getAllClientsStatistics();
    }


    @Get('getServicesFiltersMax')
    async getServicesFiltersMax() {
        return await this.servicesService.getServicesFiltersMax();
    }



    @Get('all')
    async getServices(): Promise<{ services: any[] }> {
        return { services: await this.servicesService.findAllServices() };
    }

    @Post()
    @HttpCode(201)
    async addService(@Body() body: CreateServiceDto) {
        const newService = await this.servicesService.createService(body);
        return { message: "Service successfully created", service: newService };
    }

    @Put('/:id')
    async updateService(@Param('id') id: string, @Body() body: CreateServiceDto) {
        await this.servicesService.update(Number(id), body);
    }

    @Get('getServiceById/:id')
    async updateServices(@Param('id') id: number) {
        try {
            return { service: await this.servicesService.getServiceById(Number(id)) };
        }
        catch (error) {
            console.error(error);
        }
    }

    @Delete('/:id')
    async deleteVisit(@Param('id') id: string) {
        try {
            await this.servicesService.deleteService(Number(id));
        }
        catch (error) {
            console.error(error);
        }
    }

}