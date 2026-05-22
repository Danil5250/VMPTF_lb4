import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION_TOKEN } from '../config/database.constants';
import { Pool } from 'pg';
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';

@Injectable()
export class WorkingDaysAdminService {
    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
    ) { }

    async create(createWorkingDayDto: CreateWorkingDayDto) {
        const { day_of_week, start_time_working, end_time_working, comment, autorepair_id } = createWorkingDayDto;
        const query = `
      INSERT INTO Schedule_Workings (day_of_week, start_time_working, end_time_working, comment, autorepair_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [day_of_week, start_time_working, end_time_working, comment, autorepair_id];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async findAll() {
        const query = `
      SELECT sw.*, a.name as autorepair_name 
      FROM Schedule_Workings sw
      JOIN Autorepairs a ON sw.autorepair_id = a.autorepair_id
      ORDER BY sw.schedule_id DESC
    `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async findOne(id: number) {
        const query = 'SELECT * FROM Schedule_Workings WHERE schedule_id = $1';
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    async update(id: number, updateWorkingDayDto: UpdateWorkingDayDto) {
        const fields = Object.keys(updateWorkingDayDto);
        const values = Object.values(updateWorkingDayDto);

        if (fields.length === 0) return null;

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE Schedule_Workings SET ${setClause} WHERE schedule_id = $${fields.length + 1} RETURNING *`;

        const result = await this.db.query(query, [...values, id]);
        return result.rows[0];
    }

    async remove(id: number) {
        await this.db.query('DELETE FROM Schedule_Workings WHERE schedule_id = $1', [id]);
        return { deleted: true };
    }
}
