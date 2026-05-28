import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Specialization } from '../entities/specialization.entity';
import { SpecializationAutorepair } from '../entities/specialization-autorepair.entity';
import { CreateAutorepairSpecializationDto } from './dto/create-autorepair-specialization.dto';
import { UpdateAutorepairSpecializationDto } from './dto/update-autorepair-specialization.dto';
import { AutorepairSpecializationResponse } from './dto/autorepair-specialization-response.dto';

@Injectable()
export class SpecializationService {
    constructor(
        @InjectRepository(Specialization) private specializationRepo: Repository<Specialization>,
        @InjectRepository(SpecializationAutorepair) private specAutorepairRepo: Repository<SpecializationAutorepair>,
        private readonly dataSource: DataSource,
    ) {}

    async getAllSpecializations(): Promise<Specialization[]> {
        try {
            return this.specializationRepo.find();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async createAutorepairSpecialization(dto: CreateAutorepairSpecializationDto): Promise<AutorepairSpecializationResponse> {
        try {
            const entry = this.specAutorepairRepo.create({
                autorepairId: dto.autorepair_id,
                speciltionId: dto.specialtion_id,
                model: dto.model ?? null,
                engineType: dto.engine_type ?? null,
                year: dto.year ?? null,
            });
            const created = await this.specAutorepairRepo.save(entry);

            const spec = await this.specializationRepo.findOneBy({ speciltionId: created.speciltionId });

            return {
                specialtion_autorepair_id: created.speciltionAutorepairId,
                autorepair_id: created.autorepairId,
                specialtion_id: created.speciltionId,
                model: created.model ?? undefined,
                engine_type: created.engineType ?? undefined,
                year: created.year ?? undefined,
                specialization_name: spec?.name || '',
            };
        } catch (error: any) {
            throw new BadRequestException(`Failed to create autorepair specialization: ${error.message}`);
        }
    }

    async getAutorepairSpecializations(autorepairId: number): Promise<AutorepairSpecializationResponse[]> {
        try {
            const result = await this.dataSource.query(`
                SELECT sa.specialtion_autorepair_id, sa.autorepair_id, sa.specialtion_id,
                       s.name as specialization_name, sa.model, sa.engine_type, sa.year
                FROM specialization_autorepairs sa
                JOIN specializations s ON sa.specialtion_id = s.specialtion_id
                WHERE sa.autorepair_id = $1
                ORDER BY s.name, sa.model, sa.year
            `, [autorepairId]);
            return result;
        } catch (error: any) {
            throw new BadRequestException(`Failed to get autorepair specializations: ${error.message}`);
        }
    }

    async getAllAutorepairSpecializations() {
        try {
            const result = await this.dataSource.query(`
                SELECT s.name brand, sa.model, sa.engine_type, sa.year
                FROM specialization_autorepairs sa
                JOIN specializations s ON sa.specialtion_id = s.specialtion_id
                ORDER BY s.name, sa.model, sa.year
            `);
            return result;
        } catch (error: any) {
            throw new BadRequestException(`Failed to get all autorepair specializations: ${error.message}`);
        }
    }

    async updateAutorepairSpecialization(id: number, dto: UpdateAutorepairSpecializationDto): Promise<AutorepairSpecializationResponse> {
        try {
            const updateObj: Partial<SpecializationAutorepair> = {};
            if (dto.specialtion_id !== undefined) updateObj.speciltionId = dto.specialtion_id;
            if (dto.model !== undefined) updateObj.model = dto.model;
            if (dto.engine_type !== undefined) updateObj.engineType = dto.engine_type;
            if (dto.year !== undefined) updateObj.year = dto.year;

            if (Object.keys(updateObj).length === 0) throw new BadRequestException('No fields to update');

            await this.specAutorepairRepo.update({ speciltionAutorepairId: id }, updateObj);

            const updated = await this.specAutorepairRepo.findOneBy({ speciltionAutorepairId: id });
            if (!updated) throw new NotFoundException(`Autorepair specialization with ID ${id} not found`);

            const spec = await this.specializationRepo.findOneBy({ speciltionId: updated.speciltionId });

            return {
                specialtion_autorepair_id: updated.speciltionAutorepairId,
                autorepair_id: updated.autorepairId,
                specialtion_id: updated.speciltionId,
                model: updated.model ?? undefined,
                engine_type: updated.engineType ?? undefined,
                year: updated.year ?? undefined,
                specialization_name: spec?.name || '',
            };
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            throw new BadRequestException(`Failed to update autorepair specialization: ${error.message}`);
        }
    }

    async deleteAutorepairSpecialization(id: number): Promise<void> {
        try {
            const result = await this.specAutorepairRepo.delete({ speciltionAutorepairId: id });
            if (result.affected === 0) {
                throw new NotFoundException(`Autorepair specialization with ID ${id} not found`);
            }
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Failed to delete autorepair specialization: ${error.message}`);
        }
    }
}