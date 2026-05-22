
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION_TOKEN } from '../config/database.constants';
import { Pool, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

export interface Specialization {
    specialtion_id: number;
    name: string;
}

@Injectable()
export class SpecializationAdminService {
    private readonly tableSpecialization: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableSpecialization = this.configService.get<string>('TABLE_SPECIALIZATIONS')!;
    }

    async create(createSpecializationDto: CreateSpecializationDto): Promise<Specialization> {
        try {
            const result: QueryResult<Specialization> = await this.db.query(
                `INSERT INTO ${this.tableSpecialization} (name) VALUES ($1) RETURNING *`,
                [createSpecializationDto.name]
            );
            return result.rows[0];
        } catch (error) {
            throw new BadRequestException(`Failed to create specialization: ${error.message}`);
        }
    }

    async findAll(): Promise<Specialization[]> {
        try {
            const result: QueryResult<Specialization> = await this.db.query(
                `SELECT * FROM ${this.tableSpecialization} ORDER BY specialtion_id ASC`
            );
            return result.rows;
        } catch (error) {
            throw new BadRequestException(`Failed to get specializations: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<Specialization> {
        try {
            const result: QueryResult<Specialization> = await this.db.query(
                `SELECT * FROM ${this.tableSpecialization} WHERE specialtion_id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Specialization with ID ${id} not found`);
            }

            return result.rows[0];
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to get specialization: ${error.message}`);
        }
    }

    async update(id: number, updateSpecializationDto: UpdateSpecializationDto): Promise<Specialization> {
        try {
            const result: QueryResult<Specialization> = await this.db.query(
                `UPDATE ${this.tableSpecialization} SET name = $1 WHERE specialtion_id = $2 RETURNING *`,
                [updateSpecializationDto.name, id]
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Specialization with ID ${id} not found`);
            }

            return result.rows[0];
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update specialization: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.db.query(
                `DELETE FROM ${this.tableSpecialization} WHERE specialtion_id = $1 RETURNING specialtion_id`,
                [id]
            );

            if (result.rows.length === 0) {
                throw new NotFoundException(`Specialization with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete specialization: ${error.message}`);
        }
    }
}
