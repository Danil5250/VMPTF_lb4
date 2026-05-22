import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ServiceCategoryAdminService } from './service-category-admin.service';
import { CreateCategoryServiceDto } from './dto/create-category-service.dto';
import { UpdateCategoryServiceDto } from './dto/update-category-service.dto';

@Controller('service-category-admin')
export class ServiceCategoryAdminController {
    constructor(private readonly serviceCategoryAdminService: ServiceCategoryAdminService) { }

    @Post()
    create(@Body() createCategoryServiceDto: CreateCategoryServiceDto) {
        return this.serviceCategoryAdminService.create(createCategoryServiceDto);
    }

    @Get()
    findAll() {
        return this.serviceCategoryAdminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.serviceCategoryAdminService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryServiceDto: UpdateCategoryServiceDto) {
        return this.serviceCategoryAdminService.update(+id, updateCategoryServiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.serviceCategoryAdminService.remove(+id);
    }
}
