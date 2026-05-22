import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { CreateAutorepairServiceDto } from "./dto/create-autorepair-service.dto";
import { UpdateAutorepairServiceDto } from "./dto/update-autorepair-service.dto";

@Injectable()
export class AutorepairServicesAdminService {
    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool
    ) { }

    async findAll() {
        const query = `
            SELECT 
                ars.autorepair_service_id,
                ars.autorepair_id,
                ar.name as autorepair_name,
                ars.service_id,
                s.name as service_name,
                ars.service_price,
                ars.garantie_term,
                ars.duration
            FROM Autorepair_Services ars
            JOIN Autorepairs ar ON ars.autorepair_id = ar.autorepair_id
            JOIN Services s ON ars.service_id = s.service_id
            ORDER BY ars.autorepair_service_id DESC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = `
            SELECT 
                ars.*,
                ar.name as autorepair_name,
                s.name as service_name
            FROM Autorepair_Services ars
            JOIN Autorepairs ar ON ars.autorepair_id = ar.autorepair_id
            JOIN Services s ON ars.service_id = s.service_id
            WHERE ars.autorepair_service_id = $1
        `;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Autorepair Service with ID ${id} not found`);
        }
        return result.rows[0];
    }

    async create(dto: CreateAutorepairServiceDto) {
        const query = `
            INSERT INTO Autorepair_Services (autorepair_id, service_id, service_price, garantie_term, duration)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await this.db.query(query, [
            dto.autorepair_id,
            dto.service_id,
            dto.service_price,
            dto.garantie_term || 0,
            dto.duration
        ]);
        return result.rows[0];
    }

    async update(id: number, dto: UpdateAutorepairServiceDto) {
        const existing = await this.findOne(id);
        const autorepair_id = dto.autorepair_id !== undefined ? dto.autorepair_id : existing.autorepair_id;
        const service_id = dto.service_id !== undefined ? dto.service_id : existing.service_id;
        const service_price = dto.service_price !== undefined ? dto.service_price : existing.service_price;
        const garantie_term = dto.garantie_term !== undefined ? dto.garantie_term : existing.garantie_term;
        const duration = dto.duration !== undefined ? dto.duration : existing.duration;

        const query = `
            UPDATE Autorepair_Services
            SET autorepair_id = $1, service_id = $2, service_price = $3, garantie_term = $4, duration = $5
            WHERE autorepair_service_id = $6
            RETURNING *
        `;
        const result = await this.db.query(query, [autorepair_id, service_id, service_price, garantie_term, duration, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        const result = await this.db.query('DELETE FROM Autorepair_Services WHERE autorepair_service_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Autorepair Service with ID ${id} not found`);
        }
        return { message: 'Autorepair Service deleted successfully' };
    }

    async getAutorepairsForSelect() {
        const query = `SELECT autorepair_id, name FROM Autorepairs ORDER BY name ASC`;
        const result = await this.db.query(query);
        return result.rows;
    }

    async getServicesForSelect() {
        const query = `SELECT service_id, name FROM Services ORDER BY name ASC`;
        const result = await this.db.query(query);
        return result.rows;
    }
}
