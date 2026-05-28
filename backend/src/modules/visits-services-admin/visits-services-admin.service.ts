import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VisitService } from '../entities/visit-service.entity';
import { CreateVisitServiceDto } from './dto/create-visit-service.dto';
import { UpdateVisitServiceDto } from './dto/update-visit-service.dto';

@Injectable()
export class VisitsServicesAdminService {
    constructor(
        @InjectRepository(VisitService)
        private readonly visitServiceRepo: Repository<VisitService>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createVisitServiceDto: CreateVisitServiceDto) {
        const visitService = this.visitServiceRepo.create({
            problemDescription: createVisitServiceDto.problem_description,
            visitId: createVisitServiceDto.visit_id,
            autorepairServiceId: createVisitServiceDto.autorepair_service_id,
        });

        return await this.visitServiceRepo.save(visitService);
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT vs.*, v.date_time, s.name as service_name, a.name as autorepair_name
            FROM visit_services vs
            JOIN visits v ON vs.visit_id = v.visit_id
            JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            JOIN services s ON ars.service_id = s.service_id
            JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            ORDER BY vs.visit_service_id DESC
        `);
    }

    async findOne(id: number) {
        const result = await this.dataSource.query(`
            SELECT vs.*, v.date_time, s.name as service_name, a.name as autorepair_name
            FROM visit_services vs
            JOIN visits v ON vs.visit_id = v.visit_id
            JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            JOIN services s ON ars.service_id = s.service_id
            JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            WHERE vs.visit_service_id = $1
        `, [id]);

        if (result.length === 0) {
            throw new NotFoundException(`VisitService with ID ${id} not found`);
        }

        return result[0];
    }

    async update(id: number, updateVisitServiceDto: UpdateVisitServiceDto) {
        const fields = Object.keys(updateVisitServiceDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const updateObj: any = {};
        if (updateVisitServiceDto.problem_description !== undefined) updateObj.problemDescription = updateVisitServiceDto.problem_description;
        if (updateVisitServiceDto.visit_id !== undefined) updateObj.visitId = updateVisitServiceDto.visit_id;
        if (updateVisitServiceDto.autorepair_service_id !== undefined) updateObj.autorepairServiceId = updateVisitServiceDto.autorepair_service_id;

        await this.visitServiceRepo.update({ visitServiceId: id }, updateObj);

        return await this.findOne(id);
    }

    async remove(id: number) {
        const visitService = await this.findOne(id);
        await this.visitServiceRepo.delete({ visitServiceId: id });
        return visitService;
    }

    async getVisitsForSelect() {
        return await this.dataSource.query(`
            SELECT visit_id, date_time
            FROM visits
            ORDER BY date_time DESC
        `);
    }

    async getAutorepairServicesForSelect() {
        return await this.dataSource.query(`
            SELECT ars.autorepair_service_id, s.name as service_name, a.name as autorepair_name
            FROM autorepair_services ars
            JOIN services s ON ars.service_id = s.service_id
            JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            ORDER BY a.name, s.name
        `);
    }
}
