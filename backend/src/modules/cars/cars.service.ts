import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

@Injectable()
export class CarsService {
    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool
    ) {
    }

    async create(createCarDto: CreateCarDto) {
        const { brand, model, engine_type, year, insurance, license_plate, vin, client_id } = createCarDto;
        const query = `
            INSERT INTO Cars (brand, model, engine_type, year, insurance, license_plate, vin, client_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [brand, model, engine_type, year, insurance, license_plate, vin, client_id];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async findAll() {
        const query = `
            SELECT c.*, cl.name as client_name, cl.surname as client_surname 
            FROM Cars c
            JOIN Clients cl ON c.client_id = cl.client_id
            ORDER BY c.car_id DESC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const result = await this.db.query('SELECT * FROM Cars WHERE car_id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    async update(id: number, updateCarDto: UpdateCarDto) {
        const fields = Object.keys(updateCarDto);
        const values = Object.values(updateCarDto);

        if (fields.length === 0) return null;

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE Cars SET ${setClause} WHERE car_id = $${fields.length + 1} RETURNING *`;

        // Add id as the last parameter
        const result = await this.db.query(query, [...values, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        await this.db.query('DELETE FROM Cars WHERE car_id = $1', [id]);
        return { deleted: true };
    }
}