import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autorepair } from '../entities/autorepair.entity';
import { CreateAutorepairDto } from './dto/create-autorepair.dto';
import { UpdateAutorepairDto } from './dto/update-autorepair.dto';

@Injectable()
export class AutorepairsAdminService {
    constructor(
        @InjectRepository(Autorepair)
        private readonly autorepairRepo: Repository<Autorepair>,
    ) {}

    async create(createAutorepairDto: CreateAutorepairDto) {
        const autorepair = this.autorepairRepo.create({
            name: createAutorepairDto.name,
            description: createAutorepairDto.description,
            adress: createAutorepairDto.adress,
            index: createAutorepairDto.index,
            workersAmount: createAutorepairDto.workers_amount ?? 1,
            phone: createAutorepairDto.phone,
            email: createAutorepairDto.email,
            ranking: createAutorepairDto.ranking ?? 0,
            password: createAutorepairDto.password,
        });

        return await this.autorepairRepo.save(autorepair);
    }

    async findAll() {
        const autorepairs = await this.autorepairRepo.find({
            order: { autorepairId: 'ASC' },
        });
        return autorepairs.map(a => ({
            autorepair_id: a.autorepairId,
            name: a.name,
            description: a.description,
            adress: a.adress,
            index: a.index,
            workers_amount: a.workersAmount,
            phone: a.phone,
            email: a.email,
            ranking: a.ranking,
            password: a.password
        }));
    }

    async findOne(id: number) {
        const autorepair = await this.autorepairRepo.findOneBy({ autorepairId: id });

        if (!autorepair) {
            throw new NotFoundException(`Autorepair with ID ${id} not found`);
        }

        return autorepair;
    }

    async update(id: number, updateAutorepairDto: UpdateAutorepairDto) {
        const fields = Object.keys(updateAutorepairDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const updateObj: any = {};
        if (updateAutorepairDto.name !== undefined) updateObj.name = updateAutorepairDto.name;
        if (updateAutorepairDto.description !== undefined) updateObj.description = updateAutorepairDto.description;
        if (updateAutorepairDto.adress !== undefined) updateObj.adress = updateAutorepairDto.adress;
        if (updateAutorepairDto.index !== undefined) updateObj.index = updateAutorepairDto.index;
        if (updateAutorepairDto.workers_amount !== undefined) updateObj.workersAmount = updateAutorepairDto.workers_amount;
        if (updateAutorepairDto.phone !== undefined) updateObj.phone = updateAutorepairDto.phone;
        if (updateAutorepairDto.email !== undefined) updateObj.email = updateAutorepairDto.email;
        if (updateAutorepairDto.ranking !== undefined) updateObj.ranking = updateAutorepairDto.ranking;
        if (updateAutorepairDto.password !== undefined) updateObj.password = updateAutorepairDto.password;

        await this.autorepairRepo.update({ autorepairId: id }, updateObj);

        const updated = await this.autorepairRepo.findOneBy({ autorepairId: id });
        if (!updated) {
            throw new NotFoundException(`Autorepair with ID ${id} not found`);
        }

        return updated;
    }

    async remove(id: number) {
        const autorepair = await this.findOne(id);
        await this.autorepairRepo.delete({ autorepairId: id });
        return autorepair;
    }
}
