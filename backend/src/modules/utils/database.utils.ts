import { Pool } from 'pg';

export async function findAllDataFromTable(db: Pool, tableName: string): Promise<any[]> {
    const result = await db.query(`SELECT * FROM ${tableName}`);
    console.log(result.rows);
    return result.rows;
}