
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SpecializationAutorepairsAdminService } from './specialization-autorepairs-admin.service';
import { CreateSpecializationAutorepairDto } from './dto/create-specialization-autorepair.dto';
import { UpdateSpecializationAutorepairDto } from './dto/update-specialization-autorepair.dto';

@Controller('admin/specialization-autorepairs')
export class SpecializationAutorepairsAdminController {
    constructor(private readonly service: SpecializationAutorepairsAdminService) { }

    @Post()
    create(@Body() dto: CreateSpecializationAutorepairDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('autorepairs')
    getAutorepairs() {
        return this.service.getAutorepairsForSelect();
    }

    @Get('specializations')
    getSpecializations() {
        return this.service.getSpecializationsForSelect();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpecializationAutorepairDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
