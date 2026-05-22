import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Inject } from "@nestjs/common";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { CarsService } from "./cars.service";

@Controller("cars")
export class CarsController {
    constructor(private readonly carsService: CarsService) {
    }

    @Post()
    async create(@Body() createCarDto: CreateCarDto) {
        return await this.carsService.create(createCarDto);
    }

    @Get("all")
    async findAll() {
        return await this.carsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return await this.carsService.findOne(id);
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCarDto: UpdateCarDto) {
        return await this.carsService.update(id, updateCarDto);
    }

    @Delete(":id")
    async remove(@Param("id", ParseIntPipe) id: number) {
        return await this.carsService.remove(id);
    }
}