import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SpecializationAutorepair } from '../entities/specialization-autorepair.entity';
import { CreateSpecializationAutorepairDto } from './dto/create-specialization-autorepair.dto';
import { UpdateSpecializationAutorepairDto } from './dto/update-specialization-autorepair.dto';

@Injectable()
export class SpecializationAutorepairsAdminService {
    constructor(
        @InjectRepository(SpecializationAutorepair)
        private readonly specAutorepairRepo: Repository<SpecializationAutorepair>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createSpecializationAutorepairDto: CreateSpecializationAutorepairDto) {
        const specAutorepair = this.specAutorepairRepo.create({
            model: createSpecializationAutorepairDto.model,
            engineType: createSpecializationAutorepairDto.engine_type,
            year: createSpecializationAutorepairDto.year,
            autorepairId: createSpecializationAutorepairDto.autorepair_id,
            speciltionId: createSpecializationAutorepairDto.specialtion_id,
        });

        return await this.specAutorepairRepo.save(specAutorepair);
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT sa.*, a.name as autorepair_name, s.name as specialization_name
            FROM specialization_autorepairs sa
            JOIN autorepairs a ON sa.autorepair_id = a.autorepair_id
            JOIN specializations s ON sa.specialtion_id = s.specialtion_id
            ORDER BY sa.specialtion_autorepair_id DESC
        `);
    }

    async findOne(id: number) {
        const result = await this.dataSource.query(`
            SELECT sa.*, a.name as autorepair_name, s.name as specialization_name
            FROM specialization_autorepairs sa
            JOIN autorepairs a ON sa.autorepair_id = a.autorepair_id
            JOIN specializations s ON sa.specialtion_id = s.specialtion_id
            WHERE sa.specialtion_autorepair_id = $1
        `, [id]);

        if (result.length === 0) {
            throw new NotFoundException(`SpecializationAutorepair with ID ${id} not found`);
        }

        return result[0];
    }

    async update(id: number, updateSpecializationAutorepairDto: UpdateSpecializationAutorepairDto) {
        const fields = Object.keys(updateSpecializationAutorepairDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const updateObj: any = {};
        if (updateSpecializationAutorepairDto.model !== undefined) updateObj.model = updateSpecializationAutorepairDto.model;
        if (updateSpecializationAutorepairDto.engine_type !== undefined) updateObj.engineType = updateSpecializationAutorepairDto.engine_type;
        if (updateSpecializationAutorepairDto.year !== undefined) updateObj.year = updateSpecializationAutorepairDto.year;
        if (updateSpecializationAutorepairDto.autorepair_id !== undefined) updateObj.autorepairId = updateSpecializationAutorepairDto.autorepair_id;
        if (updateSpecializationAutorepairDto.specialtion_id !== undefined) updateObj.speciltionId = updateSpecializationAutorepairDto.specialtion_id;

        await this.specAutorepairRepo.update({ speciltionAutorepairId: id }, updateObj);

        return await this.findOne(id);
    }

    async remove(id: number) {
        const specAutorepair = await this.findOne(id);
        await this.specAutorepairRepo.delete({ speciltionAutorepairId: id });
        return specAutorepair;
    }

    async getAutorepairsForSelect() {
        return await this.dataSource.query(`
            SELECT autorepair_id, name
            FROM autorepairs
            ORDER BY name
        `);
    }

    async getSpecializationsForSelect() {
        return await this.dataSource.query(`
            SELECT specialtion_id, name
            FROM specializations
            ORDER BY name
        `);
    }
}
