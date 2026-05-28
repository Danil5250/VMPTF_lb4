import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from './add-service.dto';

export interface RetrieveServiceOptions {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minWarranty?: number;
    maxWarranty?: number;
    minDuration?: number;
    maxDuration?: number;
    sortBy?: 'name' | 'basePrice' | 'duration' | 'warranty';
    sortOrder?: 'ASC' | 'DESC';
    limit?: string;
    offset?: string;
}

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private serviceRepo: Repository<Service>,
        private readonly dataSource: DataSource,
    ) {}

    async getServices(options: Partial<RetrieveServiceOptions> = {}) {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            minWarranty,
            maxWarranty,
            minDuration,
            maxDuration,
            sortBy = 'name',
            sortOrder = 'ASC',
            limit = '5',
            offset = '0',
        } = options;

        const params: any[] = [];
        const where: string[] = [];

        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            where.push(`(LOWER(s.name) LIKE $${params.length} OR LOWER(s.description) LIKE $${params.length})`);
        }

        if (category) {
            params.push(`%${category.toLowerCase()}%`);
            where.push(`LOWER(Cs.category_name) LIKE $${params.length}`);
        }

        if (minPrice !== undefined) { params.push(minPrice); where.push(`TAS.service_price >= $${params.length}`); }
        if (maxPrice !== undefined) { params.push(maxPrice); where.push(`TAS.service_price <= $${params.length}`); }
        if (minWarranty !== undefined) { params.push(minWarranty); where.push(`TAS.garantie_term >= $${params.length}`); }
        if (maxWarranty !== undefined) { params.push(maxWarranty); where.push(`TAS.garantie_term <= $${params.length}`); }
        if (minDuration !== undefined) { params.push(minDuration); where.push(`TAS.duration >= $${params.length}`); }
        if (maxDuration !== undefined) { params.push(maxDuration); where.push(`TAS.duration <= $${params.length}`); }

        const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const validSort: Record<string, string> = {
            name: 's.name',
            basePrice: 'TAS.service_price',
            duration: 'TAS.duration',
            warranty: 'TAS.garantie_term',
        };
        const orderColumn = validSort[sortBy] || 's.name';
        const orderSQL = sortOrder === 'DESC' ? 'DESC' : 'ASC';

        params.push(parseInt(limit));
        const limitIndex = params.length;
        params.push(parseInt(offset));
        const offsetIndex = params.length;

        const query = `
            SELECT tas.autorepair_service_id, s.name, s.description,
                   TAS.service_price, TAS.garantie_term, TAS.duration,
                   Cs.category_name, a.autorepair_id,
                   A.name AUTOREPAIR_NAME, A.phone AUTOREPAIR_PHONE, A.email AUTOREPAIR_EMAIL
            FROM services s
            LEFT JOIN autorepair_services TAS ON S.service_id = TAS.service_id
            LEFT JOIN category_services CS ON CS.category_service_id = S.category_services_id
            LEFT JOIN autorepairs A ON A.autorepair_id = TAS.autorepair_id
            ${whereSQL}
            ORDER BY ${orderColumn} ${orderSQL}
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;

        try {
            console.log(query);
            console.log(params);
            const result = await this.dataSource.query(query, params);
            console.log(result);
            return result;
        } catch (error) {
            console.error('Database error in getServices:', error);
            throw error;
        }
    }

    async getAllClientsStatistics() {
        const result = await this.dataSource.query(`
            SELECT DISTINCT
                s.name AS назва_послуги,
                s.description AS опис_послуги,
                (SELECT MIN(ars2.service_price) FROM autorepair_services ars2 WHERE ars2.service_id = s.service_id) AS мінімальна_ціна,
                (SELECT AVG(ars3.service_price) FROM autorepair_services ars3 WHERE ars3.service_id = s.service_id) AS середня_ціна,
                a.name AS назва_автомайстерні,
                ars.service_price AS базова_вартість,
                ars.garantie_term AS гарантійний_термін,
                ars.duration AS тривалість,
                a.phone AS телефон_автомайстерні,
                a.email AS email_автомайстерні
            FROM services s
            LEFT JOIN autorepair_services ars ON s.service_id = ars.service_id
            LEFT JOIN autorepairs a ON ars.autorepair_id = a.autorepair_id
            ORDER BY s.name, a.name
        `);
        return result;
    }

    async getServicesFiltersMax() {
        const maxPrice = await this.dataSource.query(`SELECT MAX(service_price) bound FROM autorepair_services`);
        const maxGarantee = await this.dataSource.query(`SELECT MAX(garantie_term) bound FROM autorepair_services`);
        const maxDuration = await this.dataSource.query(`SELECT MAX(duration) bound FROM autorepair_services`);

        return {
            maxPrice: maxPrice[0].bound,
            maxGarantee: maxGarantee[0].bound,
            maxDuration: maxDuration[0].bound,
        };
    }

    async findAllServices(): Promise<any[]> {
        const services = await this.serviceRepo.find();
        return services.map(s => ({
            service_id: s.serviceId,
            name: s.name,
            description: s.description,
            category_services_id: s.categoryServicesId
        }));
    }

    async createService(createServiceDto: CreateServiceDto) {
        try {
            const service = this.serviceRepo.create({
                name: createServiceDto.name,
                description: createServiceDto.description,
                categoryServicesId: createServiceDto.category_services_id,
            });
            return await this.serviceRepo.save(service);
        } catch (err: any) {
            console.log('Error creating service:', err.message);
        }
    }

    async deleteService(id: number) {
        await this.serviceRepo.delete({ serviceId: id });
    }

    async getServiceById(id: number) {
        const result = await this.serviceRepo.findOneBy({ serviceId: id });
        console.log(result);
        return result;
    }

    async update(id: number, dto: CreateServiceDto) {
        const { name, description, category_services_id } = dto;
        await this.serviceRepo.update({ serviceId: id }, {
            name,
            description,
            categoryServicesId: category_services_id,
        });
    }
}