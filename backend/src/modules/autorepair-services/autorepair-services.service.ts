import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool, QueryResult } from "pg";
import { ConfigService } from "@nestjs/config";
import { CreateAutorepairServiceDto } from "./dto/create-autorepair-service.dto";
import { UpdateAutorepairServiceDto } from "./dto/update-autorepair-service.dto";
import { AutorepairServiceResponse } from "./dto/autorepair-service-response.dto";

export interface Service {
    service_id: number;
    name: string;
}

@Injectable()
export class AutorepairServicesService {
    private readonly tableServices: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableServices = this.configService.get<string>('TABLE_SERVICES')!;
    }

    async getAllServices(): Promise<Service[]> {
        try {
            const result: QueryResult<Service> = await this.db.query(
                `SELECT service_id, name FROM ${this.tableServices}`
            );
            return result.rows;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async createAutorepairService(dto: CreateAutorepairServiceDto): Promise<AutorepairServiceResponse> {
        try {
            const result = await this.db.query(
                `INSERT INTO autorepair_services
                (autorepair_id, service_id, service_price, garantie_term, duration)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING autorepair_service_id, autorepair_id, service_id, service_price, garantie_term, duration`,
                [dto.autorepair_id, dto.service_id, dto.service_price, dto.garantie_term || 0, dto.duration]
            );

            const created = result.rows[0];

            // Get service name
            const serviceResult = await this.db.query(
                `SELECT name FROM ${this.tableServices} WHERE service_id = $1`,
                [created.service_id]
            );

            return {
                ...created,
                service_name: serviceResult.rows[0]?.name || ''
            };
        } catch (error) {
            throw new BadRequestException(`Failed to create autorepair service: ${error.message}`);
        }
    }

    async getAutorepairServices(autorepairId: number): Promise<AutorepairServiceResponse[]> {
        try {
            const result = await this.db.query(
                `SELECT 
                    ars.autorepair_service_id,
                    ars.autorepair_id,
                    ars.service_id,
                    s.name as service_name,
                    ars.service_price,
                    ars.garantie_term,
                    ars.duration
                FROM autorepair_services ars
                JOIN ${this.tableServices} s ON ars.service_id = s.service_id
                WHERE ars.autorepair_id = $1
                ORDER BY s.name`,
                [autorepairId]
            );
            return result.rows;
        } catch (error) {
            throw new BadRequestException(`Failed to get autorepair services: ${error.message}`);
        }
    }

    async updateAutorepairService(
        id: number,
        dto: UpdateAutorepairServiceDto
    ): Promise<AutorepairServiceResponse> {
        try {
            const updates: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (dto.service_id !== undefined) {
                updates.push(`service_id = $${paramIndex++}`);
                values.push(dto.service_id);
            }
            if (dto.service_price !== undefined) {
                updates.push(`service_price = $${paramIndex++}`);
                values.push(dto.service_price);
            }
            if (dto.garantie_term !== undefined) {
                updates.push(`garantie_term = $${paramIndex++}`);
                values.push(dto.garantie_term);
            }
            if (dto.duration !== undefined) {
                updates.push(`duration = $${paramIndex++}`);
                values.push(dto.duration);
            }

            if (updates.length === 0) {
                throw new BadRequestException('No fields to update');
            }

            values.push(id);

            const result = await this.db.query(
                `UPDATE autorepair_services
                SET ${updates.join(', ')}
                WHERE autorepair_service_id = $${paramIndex}
                RETURNING autorepair_service_id, autorepair_id, service_id, service_price, garantie_term, duration`,
                values
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Autorepair service with ID ${id} not found`);
            }

            const updated = result.rows[0];

            const serviceResult = await this.db.query(
                `SELECT name FROM ${this.tableServices} WHERE service_id = $1`,
                [updated.service_id]
            );

            return {
                ...updated,
                service_name: serviceResult.rows[0]?.name || ''
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update autorepair service: ${error.message}`);
        }
    }

    async deleteAutorepairService(id: number): Promise<void> {
        try {
            const result = await this.db.query(
                `DELETE FROM autorepair_services
                WHERE autorepair_service_id = $1
                RETURNING autorepair_service_id`,
                [id]
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Autorepair service with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Не можна видалити послугу`);
        }
    }
}
