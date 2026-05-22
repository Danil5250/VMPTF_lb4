import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { findAllDataFromTable } from '../utils/database.utils';
import { CreateClientDto } from "../clients/dto/add-client.dto";
import { CreateServiceDto } from "./add-service.dto";



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



interface ServiceStatistic {
    назва_послуги: string;
    опис_послуги: string;
    мінімальна_ціна: string;
    середня_ціна: string;
    назва_автомайстерні: string;
    базова_вартість: string;
    гарантійний_термін: number;
    тривалість: number;
    телефон_автомайстерні: string;
    email_автомайстерні: string;
}


@Injectable()
export class ServicesService {

    private readonly tableServicesName: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableServicesName = this.configService.get<string>('TABLE_SERVICES')!;
    }

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
            offset = '0'
        } = options;

        const params: any[] = [];
        const where: string[] = [];

        // Пошук за назвою та описом
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            where.push(`(
        LOWER(s.name) LIKE $${params.length} OR 
        LOWER(s.description) LIKE $${params.length}
      )`);
        }

        // Фільтрація за категорією
        if (category) {
            params.push(`%${category.toLowerCase()}%`);
            where.push(`LOWER(Cs.category_name) LIKE $${params.length}`);
        }

        // Фільтрація за ціною
        if (minPrice !== undefined) {
            params.push(minPrice);
            where.push(`TAS.service_price >= $${params.length}`);
        }

        if (maxPrice !== undefined) {
            params.push(maxPrice);
            where.push(`TAS.service_price <= $${params.length}`);
        }

        // Фільтрація за гарантією
        if (minWarranty !== undefined) {
            params.push(minWarranty);
            where.push(`TAS.garantie_term >= $${params.length}`);
        }

        if (maxWarranty !== undefined) {
            params.push(maxWarranty);
            where.push(`TAS.garantie_term <= $${params.length}`);
        }

        // Фільтрація за тривалістю
        if (minDuration !== undefined) {
            params.push(minDuration);
            where.push(`TAS.duration >= $${params.length}`);
        }

        if (maxDuration !== undefined) {
            params.push(maxDuration);
            where.push(`TAS.duration <= $${params.length}`);
        }

        const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

        // Валідація та маппінг полів для сортування
        const validSort = {
            name: 's.name',
            basePrice: 'TAS.service_price',
            duration: 'TAS.duration',
            warranty: 'TAS.garantie_term'
        }[sortBy] || 's.name';

        const orderSQL = sortOrder === 'DESC' ? 'DESC' : 'ASC';

        // Додаємо параметри для пагінації
        params.push(parseInt(limit));
        const limitIndex = params.length;

        params.push(parseInt(offset));
        const offsetIndex = params.length;

        const query = `
      SELECT
        tas.autorepair_service_id,
        s.name,
        s.description,
        TAS.service_price,
        TAS.garantie_term,
        TAS.duration,
        Cs.category_name,
        a.autorepair_id,
        A.name AUTOREPAIR_NAME,
        A.PHONE AUTOREPAIR_PHONE,
        A.EMAIL AUTOREPAIR_EMAIL
      FROM services s
          LEFT JOIN Autorepair_Services TAS ON S.service_id = TAS.service_id
          LEFT JOIN Category_Services CS ON CS.category_service_id = S.category_services_id
          LEFT JOIN AUTOREPAIRS A ON A.AUTOREPAIR_ID = TAS.AUTOREPAIR_ID
      ${whereSQL}
      ORDER BY ${validSort} ${orderSQL}
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `;

        try {
            console.log(query)
            console.log(params)
            const result = await this.db.query(query, params);
            console.log(result.rows)
            return result.rows;
        } catch (error) {
            console.error('Database error in getServices:', error);
            throw error;
        }
    }



    async getAllClientsStatistics() {
        const result = await this.db.query(`
        SELECT 
DISTINCT
    s.name AS назва_послуги,
    s.description AS опис_послуги,
    (
        SELECT MIN(ars2.service_price)
        FROM Autorepair_Services ars2
        WHERE ars2.service_id = s.service_id
    ) AS мінімальна_ціна,
    (
        SELECT AVG(ars3.service_price)
        FROM Autorepair_Services ars3
        WHERE ars3.service_id = s.service_id
    ) AS середня_ціна,
    a.name AS назва_автомайстерні,
    ars.service_price AS базова_вартість,
    ars.garantie_term AS гарантійний_термін,
    ars.duration AS тривалість,
    a.phone AS телефон_автомайстерні,
    a.email AS email_автомайстерні
FROM Services s
LEFT JOIN Autorepair_Services ars ON s.service_id = ars.service_id
LEFT JOIN Autorepairs a ON ars.autorepair_id = a.autorepair_id
ORDER BY s.name, a.name;
        `);

        return result.rows;
    }


    async getServicesFiltersMax() {
        const maxPrice = await this.db.query(`
        SELECT MAX(service_price) bound FROM Autorepair_Services`);

        const maxGarantee = await this.db.query(`
        SELECT MAX(garantie_term) bound FROM Autorepair_Services`);

        const maxDuration = await this.db.query(`
        SELECT MAX(duration) bound FROM Autorepair_Services`);

        return { maxPrice: maxPrice.rows[0].bound, maxGarantee: maxGarantee.rows[0].bound, maxDuration: maxDuration.rows[0].bound }
    }









    async findAllServices(): Promise<any[]> {
        return findAllDataFromTable(this.db, this.tableServicesName);
    }

    async createService(createServiceDto: CreateServiceDto) {
        try {
            const query = `
      INSERT INTO ${this.tableServicesName} 
        (name, description, category_services_id) 
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
            const values = [
                createServiceDto.name,
                createServiceDto.description,
                createServiceDto.category_services_id,
            ];

            const result = await this.db.query(query, values);
            return result.rows[0];
        }
        catch (err) {
            console.log('Error creating service:', err.message);
        }
    }

    async deleteService(id: number) {
        await this.db.query(`DELETE FROM ${this.tableServicesName} WHERE service_id = $1`, [id]);
    }

    async getServiceById(id: number) {
        const result = await this.db.query(`SELECT * FROM ${this.tableServicesName} 
         WHERE id_service = $1;`, [id]);
        console.log(result.rows[0])
        return result.rows[0];
    }

    async update(id: number, dto: CreateServiceDto) {
        const { name, description, category_services_id } = dto;
        await this.db.query(
            `UPDATE ${this.tableServicesName}
       SET name = $1, description = $2, category_services_id = $3
       WHERE service_id = $4`,
            [name, description, category_services_id, id]
        );
    }
}