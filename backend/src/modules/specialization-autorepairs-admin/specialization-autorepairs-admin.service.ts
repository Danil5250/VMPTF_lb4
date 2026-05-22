
import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { CreateSpecializationAutorepairDto } from "./dto/create-specialization-autorepair.dto";
import { UpdateSpecializationAutorepairDto } from "./dto/update-specialization-autorepair.dto";

@Injectable()
export class SpecializationAutorepairsAdminService {
    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool
    ) { }

    async findAll() {
        const query = `
            SELECT 
                sa.specialtion_autorepair_id,
                sa.model,
                sa.engine_type,
                sa.year,
                sa.autorepair_id,
                ar.name as autorepair_name,
                sa.specialtion_id,
                s.name as specialization_name
            FROM Specialization_Autorepairs sa
            JOIN Autorepairs ar ON sa.autorepair_id = ar.autorepair_id
            JOIN Specializations s ON sa.specialtion_id = s.specialtion_id
            ORDER BY sa.specialtion_autorepair_id DESC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = `
            SELECT 
                sa.*,
                ar.name as autorepair_name,
                s.name as specialization_name
            FROM Specialization_Autorepairs sa
            JOIN Autorepairs ar ON sa.autorepair_id = ar.autorepair_id
            JOIN Specializations s ON sa.specialtion_id = s.specialtion_id
            WHERE sa.specialtion_autorepair_id = $1
        `;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Specialization Autorepair with ID ${id} not found`);
        }
        return result.rows[0];
    }

    async create(dto: CreateSpecializationAutorepairDto) {
        const query = `
            INSERT INTO Specialization_Autorepairs (model, engine_type, year, autorepair_id, specialtion_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await this.db.query(query, [
            dto.model || null,
            dto.engine_type || null,
            dto.year || null,
            dto.autorepair_id,
            dto.specialtion_id
        ]);
        return result.rows[0];
    }

    async update(id: number, dto: UpdateSpecializationAutorepairDto) {
        const existing = await this.findOne(id);
        const model = dto.model !== undefined ? dto.model : existing.model;
        const engine_type = dto.engine_type !== undefined ? dto.engine_type : existing.engine_type;
        const year = dto.year !== undefined ? dto.year : existing.year;
        const autorepair_id = dto.autorepair_id !== undefined ? dto.autorepair_id : existing.autorepair_id;
        const specialtion_id = dto.specialtion_id !== undefined ? dto.specialtion_id : existing.specialtion_id;

        const query = `
            UPDATE Specialization_Autorepairs
            SET model = $1, engine_type = $2, year = $3, autorepair_id = $4, specialtion_id = $5
            WHERE specialtion_autorepair_id = $6
            RETURNING *
        `;
        const result = await this.db.query(query, [model, engine_type, year, autorepair_id, specialtion_id, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        const result = await this.db.query('DELETE FROM Specialization_Autorepairs WHERE specialtion_autorepair_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Specialization Autorepair with ID ${id} not found`);
        }
        return { message: 'Specialization Autorepair deleted successfully' };
    }

    async getAutorepairsForSelect() {
        const query = `SELECT autorepair_id, name FROM Autorepairs ORDER BY name`;
        const result = await this.db.query(query);
        return result.rows;
    }

    async getSpecializationsForSelect() {
        const query = `SELECT specialtion_id, name FROM Specializations ORDER BY name`;
        const result = await this.db.query(query);
        return result.rows;
    }
}
