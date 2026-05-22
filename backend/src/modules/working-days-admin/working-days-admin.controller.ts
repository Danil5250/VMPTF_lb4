import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkingDaysAdminService } from './working-days-admin.service';
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';

@Controller('working-days-admin')
export class WorkingDaysAdminController {
    constructor(private readonly workingDaysAdminService: WorkingDaysAdminService) { }

    @Post()
    create(@Body() createWorkingDayDto: CreateWorkingDayDto) {
        return this.workingDaysAdminService.create(createWorkingDayDto);
    }

    @Get()
    findAll() {
        return this.workingDaysAdminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.workingDaysAdminService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWorkingDayDto: UpdateWorkingDayDto) {
        return this.workingDaysAdminService.update(+id, updateWorkingDayDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.workingDaysAdminService.remove(+id);
    }
}
