import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AutorepairServicesAdminService } from './autorepair-services-admin.service';
import { CreateAutorepairServiceDto } from './dto/create-autorepair-service.dto';
import { UpdateAutorepairServiceDto } from './dto/update-autorepair-service.dto';

@Controller('autorepair-services-admin')
export class AutorepairServicesAdminController {
    constructor(private readonly autorepairServicesAdminService: AutorepairServicesAdminService) { }

    @Post()
    create(@Body() createAutorepairServiceDto: CreateAutorepairServiceDto) {
        return this.autorepairServicesAdminService.create(createAutorepairServiceDto);
    }

    @Get()
    findAll() {
        return this.autorepairServicesAdminService.findAll();
    }

    @Get('autorepairs-select')
    getAutorepairsForSelect() {
        return this.autorepairServicesAdminService.getAutorepairsForSelect();
    }

    @Get('services-select')
    getServicesForSelect() {
        return this.autorepairServicesAdminService.getServicesForSelect();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.autorepairServicesAdminService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAutorepairServiceDto: UpdateAutorepairServiceDto) {
        return this.autorepairServicesAdminService.update(id, updateAutorepairServiceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.autorepairServicesAdminService.remove(id);
    }
}
