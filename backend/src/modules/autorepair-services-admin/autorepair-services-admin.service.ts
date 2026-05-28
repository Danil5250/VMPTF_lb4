import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AutorepairService } from '../entities/autorepair-service.entity';
import { CreateAutorepairServiceDto } from './dto/create-autorepair-service.dto';
import { UpdateAutorepairServiceDto } from './dto/update-autorepair-service.dto';

@Injectable()
export class AutorepairServicesAdminService {
    constructor(
        @InjectRepository(AutorepairService)
        private readonly autorepairServiceRepo: Repository<AutorepairService>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createAutorepairServiceDto: CreateAutorepairServiceDto) {
        const autorepairService = this.autorepairServiceRepo.create({
            autorepairId: createAutorepairServiceDto.autorepair_id,
            serviceId: createAutorepairServiceDto.service_id,
            servicePrice: createAutorepairServiceDto.service_price,
            garantieTerm: createAutorepairServiceDto.garantie_term,
            duration: createAutorepairServiceDto.duration,
        });

        return await this.autorepairServiceRepo.save(autorepairService);
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT ars.*, a.name as autorepair_name, s.name as service_name
            FROM autorepair_services ars
            JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            JOIN services s ON ars.service_id = s.service_id
            ORDER BY ars.autorepair_service_id DESC
        `);
    }

    async findOne(id: number) {
        const result = await this.dataSource.query(`
            SELECT ars.*, a.name as autorepair_name, s.name as service_name
            FROM autorepair_services ars
            JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            JOIN services s ON ars.service_id = s.service_id
            WHERE ars.autorepair_service_id = $1
        `, [id]);

        if (result.length === 0) {
            throw new NotFoundException(`AutorepairService with ID ${id} not found`);
        }

        return result[0];
    }

    async update(id: number, updateAutorepairServiceDto: UpdateAutorepairServiceDto) {
        const fields = Object.keys(updateAutorepairServiceDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const updateObj: any = {};
        if (updateAutorepairServiceDto.autorepair_id !== undefined) updateObj.autorepairId = updateAutorepairServiceDto.autorepair_id;
        if (updateAutorepairServiceDto.service_id !== undefined) updateObj.serviceId = updateAutorepairServiceDto.service_id;
        if (updateAutorepairServiceDto.service_price !== undefined) updateObj.servicePrice = updateAutorepairServiceDto.service_price;
        if (updateAutorepairServiceDto.garantie_term !== undefined) updateObj.garantieTerm = updateAutorepairServiceDto.garantie_term;
        if (updateAutorepairServiceDto.duration !== undefined) updateObj.duration = updateAutorepairServiceDto.duration;

        await this.autorepairServiceRepo.update({ autorepairServiceId: id }, updateObj);

        return await this.findOne(id);
    }

    async remove(id: number) {
        const autorepairService = await this.findOne(id);
        await this.autorepairServiceRepo.delete({ autorepairServiceId: id });
        return autorepairService;
    }

    async getAutorepairsForSelect() {
        return await this.dataSource.query(`
            SELECT autorepair_id, name
            FROM autorepairs
            ORDER BY name
        `);
    }

    async getServicesForSelect() {
        return await this.dataSource.query(`
            SELECT service_id, name
            FROM services
            ORDER BY name
        `);
    }
}
