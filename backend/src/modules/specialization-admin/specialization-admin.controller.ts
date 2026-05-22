
import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { SpecializationAdminService } from './specialization-admin.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Controller('specialization-admin')
export class SpecializationAdminController {
    constructor(private readonly specializationAdminService: SpecializationAdminService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createSpecializationDto: CreateSpecializationDto) {
        return this.specializationAdminService.create(createSpecializationDto);
    }

    @Get()
    findAll() {
        return this.specializationAdminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.specializationAdminService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSpecializationDto: UpdateSpecializationDto) {
        return this.specializationAdminService.update(id, updateSpecializationDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.specializationAdminService.remove(id);
    }
}
