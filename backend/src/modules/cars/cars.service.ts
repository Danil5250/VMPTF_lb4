import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car) private carRepo: Repository<Car>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createCarDto: CreateCarDto) {
        const { brand, model, engine_type, year, insurance, license_plate, vin, client_id } = createCarDto;
        const car = this.carRepo.create({
            brand,
            model,
            engineType: engine_type,
            year,
            insurance: insurance ? new Date(insurance) : null,
            licensePlate: license_plate,
            vin,
            clientId: client_id,
        });
        return this.carRepo.save(car);
    }

    async findAll() {
        return this.dataSource.query(`
            SELECT c.*, cl.name as client_name, cl.surname as client_surname
            FROM cars c
            JOIN clients cl ON c.client_id = cl.client_id
            ORDER BY c.car_id DESC
        `);
    }

    async findOne(id: number) {
        return this.carRepo.findOneBy({ carId: id });
    }

    async update(id: number, updateCarDto: UpdateCarDto) {
        const fields = Object.keys(updateCarDto);
        const values = Object.values(updateCarDto);

        if (fields.length === 0) return null;

        // Map camelCase to snake_case for DB columns
        const fieldMap: Record<string, string> = {
            brand: 'brand',
            model: 'model',
            engine_type: 'engine_type',
            year: 'year',
            insurance: 'insurance',
            license_plate: 'license_plate',
            vin: 'vin',
            client_id: 'client_id',
        };

        const setClause = fields.map((field, index) => `${fieldMap[field] || field} = $${index + 1}`).join(', ');
        const result = await this.dataSource.query(
            `UPDATE cars SET ${setClause} WHERE car_id = $${fields.length + 1} RETURNING *`,
            [...values, id],
        );
        return result[0];
    }

    async remove(id: number) {
        await this.carRepo.delete({ carId: id });
        return { deleted: true };
    }
}