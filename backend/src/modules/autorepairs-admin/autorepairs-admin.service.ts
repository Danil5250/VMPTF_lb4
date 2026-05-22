
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION_TOKEN } from '../config/database.constants';
import { CreateAutorepairDto } from './dto/create-autorepair.dto';
import { UpdateAutorepairDto } from './dto/update-autorepair.dto';

@Injectable()
export class AutorepairsAdminService {
    private readonly tableAutorepairs: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService,
    ) {
        this.tableAutorepairs = this.configService.get<string>('TABLE_AUTOREPAIRS') || 'Autorepairs';
    }

    async create(createAutorepairDto: CreateAutorepairDto) {
        const {
            name,
            description,
            adress,
            index,
            workers_amount,
            phone,
            email,
            ranking,
            password,
        } = createAutorepairDto;

        const query = `
            INSERT INTO ${this.tableAutorepairs} (
                name, description, adress, index, workers_amount, phone, email, ranking, password
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            name,
            description,
            adress,
            index,
            workers_amount ?? 1,
            phone,
            email,
            ranking ?? 0,
            password,
        ];

        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async findAll() {
        const query = `SELECT * FROM ${this.tableAutorepairs} ORDER BY autorepair_id`;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = `SELECT * FROM ${this.tableAutorepairs} WHERE autorepair_id = $1`;
        const result = await this.db.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundException(`Autorepair with ID ${id} not found`);
        }

        return result.rows[0];
    }

    async update(id: number, updateAutorepairDto: UpdateAutorepairDto) {
        const fields = Object.keys(updateAutorepairDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const setClause = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(', ');

        const values = [id, ...Object.values(updateAutorepairDto)];

        const query = `
            UPDATE ${this.tableAutorepairs}
            SET ${setClause}
            WHERE autorepair_id = $1
            RETURNING *;
        `;

        const result = await this.db.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundException(`Autorepair with ID ${id} not found`);
        }

        return result.rows[0];
    }

    async remove(id: number) {
        const query = `DELETE FROM ${this.tableAutorepairs} WHERE autorepair_id = $1 RETURNING *`;
        const result = await this.db.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundException(`Autorepair with ID ${id} not found`);
        }

        return result.rows[0];
    }
}
