import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { CreateVisitServiceDto } from "./dto/create-visit-service.dto";
import { UpdateVisitServiceDto } from "./dto/update-visit-service.dto";

@Injectable()
export class VisitsServicesAdminService {
    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool
    ) { }

    async findAll() {
        const query = `
            SELECT 
                vs.visit_service_id,
                vs.problem_description,
                vs.visit_id,
                v.date_time as visit_date_time,
                vs.autorepair_service_id,
                ars.service_price,
                s.name as service_name,
                ar.name as autorepair_name
            FROM Visit_Services vs
            JOIN Visits v ON vs.visit_id = v.visit_id
            JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            JOIN Services s ON ars.service_id = s.service_id
            JOIN Autorepairs ar ON ars.autorepair_id = ar.autorepair_id
            ORDER BY vs.visit_service_id DESC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = `
            SELECT 
                vs.*,
                v.date_time as visit_date_time,
                s.name as service_name,
                ar.name as autorepair_name,
                ars.service_price
            FROM Visit_Services vs
            JOIN Visits v ON vs.visit_id = v.visit_id
            JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            JOIN Services s ON ars.service_id = s.service_id
            JOIN Autorepairs ar ON ars.autorepair_id = ar.autorepair_id
            WHERE vs.visit_service_id = $1
        `;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Visit Service with ID ${id} not found`);
        }
        return result.rows[0];
    }

    async create(dto: CreateVisitServiceDto) {
        const query = `
            INSERT INTO Visit_Services (problem_description, visit_id, autorepair_service_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await this.db.query(query, [
            dto.problem_description || null,
            dto.visit_id,
            dto.autorepair_service_id
        ]);
        return result.rows[0];
    }

    async update(id: number, dto: UpdateVisitServiceDto) {
        const existing = await this.findOne(id);
        const problem_description = dto.problem_description !== undefined ? dto.problem_description : existing.problem_description;
        const visit_id = dto.visit_id !== undefined ? dto.visit_id : existing.visit_id;
        const autorepair_service_id = dto.autorepair_service_id !== undefined ? dto.autorepair_service_id : existing.autorepair_service_id;

        const query = `
            UPDATE Visit_Services
            SET problem_description = $1, visit_id = $2, autorepair_service_id = $3
            WHERE visit_service_id = $4
            RETURNING *
        `;
        const result = await this.db.query(query, [problem_description, visit_id, autorepair_service_id, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        const result = await this.db.query('DELETE FROM Visit_Services WHERE visit_service_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Visit Service with ID ${id} not found`);
        }
        return { message: 'Visit Service deleted successfully' };
    }

    async getVisitsForSelect() {
        const query = `SELECT visit_id, date_time FROM Visits ORDER BY date_time DESC`;
        const result = await this.db.query(query);
        return result.rows;
    }

    async getAutorepairServicesForSelect() {
        const query = `
            SELECT 
                ars.autorepair_service_id,
                s.name as service_name,
                ars.service_price,
                ar.name as autorepair_name
            FROM Autorepair_Services ars
            JOIN Services s ON ars.service_id = s.service_id
            JOIN Autorepairs ar ON ars.autorepair_id = ar.autorepair_id
            ORDER BY ar.name, s.name
        `;
        const result = await this.db.query(query);
        return result.rows;
    }
}
