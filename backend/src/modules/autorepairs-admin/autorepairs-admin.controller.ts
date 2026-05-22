
import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { AutorepairsAdminService } from './autorepairs-admin.service';
import { CreateAutorepairDto } from './dto/create-autorepair.dto';
import { UpdateAutorepairDto } from './dto/update-autorepair.dto';

@Controller('autorepairs-admin')
export class AutorepairsAdminController {
    constructor(private readonly autorepairsAdminService: AutorepairsAdminService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createAutorepairDto: CreateAutorepairDto) {
        return this.autorepairsAdminService.create(createAutorepairDto);
    }

    @Get()
    findAll() {
        return this.autorepairsAdminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.autorepairsAdminService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAutorepairDto: UpdateAutorepairDto) {
        return this.autorepairsAdminService.update(id, updateAutorepairDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.autorepairsAdminService.remove(id);
    }
}
