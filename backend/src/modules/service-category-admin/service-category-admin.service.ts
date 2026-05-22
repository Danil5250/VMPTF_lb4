import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION_TOKEN } from '../config/database.constants';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { CreateCategoryServiceDto } from './dto/create-category-service.dto';
import { UpdateCategoryServiceDto } from './dto/update-category-service.dto';

@Injectable()
export class ServiceCategoryAdminService {
    private readonly tableServiceCategories: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableServiceCategories = this.configService.get<string>('TABLE_CATEGORY_SERVICES') || 'Category_Services';
    }

    async create(createCategoryServiceDto: CreateCategoryServiceDto) {
        const { category_name } = createCategoryServiceDto;
        const query = `
            INSERT INTO ${this.tableServiceCategories} (category_name)
            VALUES ($1)
            RETURNING *;
        `;
        const result = await this.db.query(query, [category_name]);
        return result.rows[0];
    }

    async findAll() {
        const query = `SELECT * FROM ${this.tableServiceCategories} ORDER BY category_service_id ASC`;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = `SELECT * FROM ${this.tableServiceCategories} WHERE category_service_id = $1`;
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, updateCategoryServiceDto: UpdateCategoryServiceDto) {
        const { category_name } = updateCategoryServiceDto;
        const query = `
            UPDATE ${this.tableServiceCategories}
            SET category_name = $1
            WHERE category_service_id = $2
            RETURNING *;
        `;
        const result = await this.db.query(query, [category_name, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        const query = `DELETE FROM ${this.tableServiceCategories} WHERE category_service_id = $1`;
        await this.db.query(query, [id]);
        return { deleted: true };
    }
}
