import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VisitsServicesAdminService } from './visits-services-admin.service';
import { CreateVisitServiceDto } from './dto/create-visit-service.dto';
import { UpdateVisitServiceDto } from './dto/update-visit-service.dto';

@Controller('visits-services-admin')
export class VisitsServicesAdminController {
    constructor(private readonly visitsServicesAdminService: VisitsServicesAdminService) { }

    @Post()
    create(@Body() createVisitServiceDto: CreateVisitServiceDto) {
        return this.visitsServicesAdminService.create(createVisitServiceDto);
    }

    @Get()
    findAll() {
        return this.visitsServicesAdminService.findAll();
    }

    @Get('visits-select')
    getVisitsForSelect() {
        return this.visitsServicesAdminService.getVisitsForSelect();
    }

    @Get('autorepair-services-select')
    getAutorepairServicesForSelect() {
        return this.visitsServicesAdminService.getAutorepairServicesForSelect();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.visitsServicesAdminService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateVisitServiceDto: UpdateVisitServiceDto) {
        return this.visitsServicesAdminService.update(id, updateVisitServiceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.visitsServicesAdminService.remove(id);
    }
}
