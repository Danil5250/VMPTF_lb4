import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool, QueryResult } from "pg";
import { ConfigService } from "@nestjs/config";
import { CreateAutorepairSpecializationDto } from "./dto/create-autorepair-specialization.dto";
import { UpdateAutorepairSpecializationDto } from "./dto/update-autorepair-specialization.dto";
import { AutorepairSpecializationResponse } from "./dto/autorepair-specialization-response.dto";

export interface Specialization {
    specialtion_id: number;
    name: string;
}

@Injectable()
export class SpecializationService {
    private readonly tableSpecialization: string;
    constructor(@Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableSpecialization = this.configService.get<string>('TABLE_SPECIALIZATIONS')!;
    }

    async getAllSpecializations(): Promise<Specialization[]> {
        try {
            const result: QueryResult<Specialization> = await this.db.query(
                `SELECT * FROM ${this.tableSpecialization}`
            );
            return result.rows;
        }
        catch (error) {
            throw new BadRequestException(error);
        }
    }

    async createAutorepairSpecialization(dto: CreateAutorepairSpecializationDto): Promise<AutorepairSpecializationResponse> {
        try {
            const result = await this.db.query(
                `INSERT INTO specialization_autorepairs
                (autorepair_id, specialtion_id, model, engine_type, year)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING specialtion_autorepair_id, autorepair_id, specialtion_id, model, engine_type, year`,
                [dto.autorepair_id, dto.specialtion_id, dto.model, dto.engine_type, dto.year]
            );

            const created = result.rows[0];

            // Get specialization name
            const specResult = await this.db.query(
                `SELECT name FROM ${this.tableSpecialization} WHERE specialtion_id = $1`,
                [created.specialtion_id]
            );

            return {
                ...created,
                specialization_name: specResult.rows[0]?.name || ''
            };
        } catch (error) {
            throw new BadRequestException(`Failed to create autorepair specialization: ${error.message}`);
        }
    }

    async getAutorepairSpecializations(autorepairId: number): Promise<AutorepairSpecializationResponse[]> {
        try {
            const result = await this.db.query(
                `SELECT 
                    sa.specialtion_autorepair_id,
                    sa.autorepair_id,
                    sa.specialtion_id,
                    s.name as specialization_name,
                    sa.model,
                    sa.engine_type,
                    sa.year
                FROM specialization_autorepairs sa
                JOIN ${this.tableSpecialization} s ON sa.specialtion_id = s.specialtion_id
                WHERE sa.autorepair_id = $1
                ORDER BY s.name, sa.model, sa.year`,
                [autorepairId]
            );
            return result.rows;
        } catch (error) {
            throw new BadRequestException(`Failed to get autorepair specializations: ${error.message}`);
        }
    }

    async getAllAutorepairSpecializations() {
        try {
            const result = await this.db.query(
                `SELECT 
                    s.name brand,
                    sa.model,
                    sa.engine_type,
                    sa.year
                FROM specialization_autorepairs sa
                JOIN ${this.tableSpecialization} s ON sa.specialtion_id = s.specialtion_id
                ORDER BY s.name, sa.model, sa.year`
            );
            return result.rows;
        } catch (error) {
            throw new BadRequestException(`Failed to get all autorepair specializations: ${error.message}`);
        }
    }


    async updateAutorepairSpecialization(
        id: number,
        dto: UpdateAutorepairSpecializationDto
    ): Promise<AutorepairSpecializationResponse> {
        try {
            const updates: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (dto.specialtion_id !== undefined) {
                updates.push(`specialtion_id = $${paramIndex++}`);
                values.push(dto.specialtion_id);
            }
            if (dto.model !== undefined) {
                updates.push(`model = $${paramIndex++}`);
                values.push(dto.model);
            }
            if (dto.engine_type !== undefined) {
                updates.push(`engine_type = $${paramIndex++}`);
                values.push(dto.engine_type);
            }
            if (dto.year !== undefined) {
                updates.push(`year = $${paramIndex++}`);
                values.push(dto.year);
            }

            if (updates.length === 0) {
                throw new BadRequestException('No fields to update');
            }

            values.push(id);

            const result = await this.db.query(
                `UPDATE specialization_autorepairs
                SET ${updates.join(', ')}
                WHERE specialtion_autorepair_id = $${paramIndex}
                RETURNING specialtion_autorepair_id, autorepair_id, specialtion_id, model, engine_type, year`,
                values
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Autorepair specialization with ID ${id} not found`);
            }

            const updated = result.rows[0];

            // Get specialization name
            const specResult = await this.db.query(
                `SELECT name FROM ${this.tableSpecialization} WHERE specialtion_id = $1`,
                [updated.specialtion_id]
            );

            return {
                ...updated,
                specialization_name: specResult.rows[0]?.name || ''
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update autorepair specialization: ${error.message}`);
        }
    }

    async deleteAutorepairSpecialization(id: number): Promise<void> {
        try {
            const result = await this.db.query(
                `DELETE FROM specialization_autorepairs
                WHERE specialtion_autorepair_id = $1
                RETURNING specialtion_autorepair_id`,
                [id]
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Autorepair specialization with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete autorepair specialization: ${error.message}`);
        }
    }

}