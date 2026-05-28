import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from '../entities/specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationAdminService {
    constructor(
        @InjectRepository(Specialization)
        private readonly specializationRepo: Repository<Specialization>,
    ) {}

    async create(createSpecializationDto: CreateSpecializationDto) {
        const specialization = this.specializationRepo.create({
            name: createSpecializationDto.name,
        });

        return await this.specializationRepo.save(specialization);
    }

    async findAll() {
        const specializations = await this.specializationRepo.find({
            order: { speciltionId: 'ASC' },
        });
        return specializations.map(s => ({
            specialtion_id: s.speciltionId,
            name: s.name
        }));
    }

    async findOne(id: number) {
        const specialization = await this.specializationRepo.findOneBy({ speciltionId: id });

        if (!specialization) {
            throw new NotFoundException(`Specialization with ID ${id} not found`);
        }

        return specialization;
    }

    async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
        if (!updateSpecializationDto.name) {
            return this.findOne(id);
        }

        await this.specializationRepo.update(
            { speciltionId: id },
            { name: updateSpecializationDto.name }
        );

        const updated = await this.specializationRepo.findOneBy({ speciltionId: id });
        if (!updated) {
            throw new NotFoundException(`Specialization with ID ${id} not found`);
        }

        return updated;
    }

    async remove(id: number) {
        const specialization = await this.findOne(id);
        await this.specializationRepo.delete({ speciltionId: id });
        return specialization;
    }
}
