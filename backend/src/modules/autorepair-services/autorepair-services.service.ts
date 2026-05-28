import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AutorepairService as AutorepairServiceEntity } from '../entities/autorepair-service.entity';
import { Service as ServiceEntity } from '../entities/service.entity';
import { CreateAutorepairServiceDto } from './dto/create-autorepair-service.dto';
import { UpdateAutorepairServiceDto } from './dto/update-autorepair-service.dto';
import { AutorepairServiceResponse } from './dto/autorepair-service-response.dto';

export interface Service {
    service_id: number;
    name: string;
}

@Injectable()
export class AutorepairServicesService {
    constructor(
        @InjectRepository(AutorepairServiceEntity) private autorepairServiceRepo: Repository<AutorepairServiceEntity>,
        @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async getAllServices(): Promise<Service[]> {
        try {
            const services = await this.serviceRepo.find({
                select: { serviceId: true, name: true },
            });
            return services.map(s => ({ service_id: s.serviceId, name: s.name }));
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }

    async createAutorepairService(dto: CreateAutorepairServiceDto): Promise<AutorepairServiceResponse> {
        try {
            const newService = this.autorepairServiceRepo.create({
                autorepairId: dto.autorepair_id,
                serviceId: dto.service_id,
                servicePrice: dto.service_price,
                garantieTerm: dto.garantie_term || 0,
                duration: dto.duration,
            });

            const created = await this.autorepairServiceRepo.save(newService);
            const service = await this.serviceRepo.findOneBy({ serviceId: created.serviceId });

            return {
                autorepair_service_id: created.autorepairServiceId,
                autorepair_id: created.autorepairId,
                service_id: created.serviceId,
                service_price: created.servicePrice,
                garantie_term: created.garantieTerm ?? 0,
                duration: created.duration,
                service_name: service?.name || '',
            };
        } catch (error: any) {
            throw new BadRequestException(`Failed to create autorepair service: ${error.message}`);
        }
    }

    async getAutorepairServices(autorepairId: number): Promise<AutorepairServiceResponse[]> {
        try {
            const result = await this.dataSource.query(`
                SELECT ars.autorepair_service_id, ars.autorepair_id, ars.service_id,
                       s.name as service_name, ars.service_price, ars.garantie_term, ars.duration
                FROM autorepair_services ars
                JOIN services s ON ars.service_id = s.service_id
                WHERE ars.autorepair_id = $1
                ORDER BY s.name
            `, [autorepairId]);
            return result;
        } catch (error: any) {
            throw new BadRequestException(`Failed to get autorepair services: ${error.message}`);
        }
    }

    async updateAutorepairService(id: number, dto: UpdateAutorepairServiceDto): Promise<AutorepairServiceResponse> {
        try {
            const updateObj: Partial<AutorepairServiceEntity> = {};
            if (dto.service_id !== undefined) updateObj.serviceId = dto.service_id;
            if (dto.service_price !== undefined) updateObj.servicePrice = dto.service_price;
            if (dto.garantie_term !== undefined) updateObj.garantieTerm = dto.garantie_term;
            if (dto.duration !== undefined) updateObj.duration = dto.duration;

            if (Object.keys(updateObj).length === 0) throw new BadRequestException('No fields to update');

            await this.autorepairServiceRepo.update({ autorepairServiceId: id }, updateObj);

            const updated = await this.autorepairServiceRepo.findOneBy({ autorepairServiceId: id });
            if (!updated) throw new NotFoundException(`Autorepair service with ID ${id} not found`);

            const service = await this.serviceRepo.findOneBy({ serviceId: updated.serviceId });

            return {
                autorepair_service_id: updated.autorepairServiceId,
                autorepair_id: updated.autorepairId,
                service_id: updated.serviceId,
                service_price: updated.servicePrice,
                garantie_term: updated.garantieTerm ?? 0,
                duration: updated.duration,
                service_name: service?.name || '',
            };
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            throw new BadRequestException(`Failed to update autorepair service: ${error.message}`);
        }
    }

    async deleteAutorepairService(id: number): Promise<void> {
        try {
            const result = await this.autorepairServiceRepo.delete({ autorepairServiceId: id });
            if (result.affected === 0) {
                throw new NotFoundException(`Autorepair service with ID ${id} not found`);
            }
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Не можна видалити послугу`);
        }
    }
}
