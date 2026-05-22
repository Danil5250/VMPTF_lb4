import {Inject, Injectable} from '@nestjs/common';
import {Pool} from "pg";
import {DATABASE_CONNECTION_TOKEN} from "./modules/config/database.constants";
import {ConfigService} from "@nestjs/config";
import {findAllDataFromTable} from "./modules/utils/database.utils";
import {CreateVisitDto} from "./modules/visits/dto/create-visit.dto";

@Injectable()
export class AppService {
  private readonly tableClientsName: string;
  private readonly tableVisitsName: string;
  private readonly tableServicesName: string;
  private readonly tableVisitsServicesName: string;

  constructor(
      @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
              private configService: ConfigService
  ) {
    this.tableClientsName = this.configService.get<string>('TABLE_CLIENTS')!;
    this.tableVisitsName = this.configService.get<string>('TABLE_VISITS')!;
    this.tableServicesName = this.configService.get<string>('TABLE_SERVICES')!;
    this.tableVisitsServicesName = this.configService.get<string>('TABLE_VISITS_SERVICES')!;
  }
  //
  // getHello(): string {
  //   return 'Hello World!';
  // }
  //
  //
  //
  //
  //
  // async findAllVisits():Promise<any[]>  {
  //   return findAllDataFromTable(this.db, this.tableVisitsName);
  // }
  //
  // async findAllVisitsClients():Promise<any[]>  {
  //   const result = await this.db.query(`SELECT date_time,alternative_date_time,
  //      note,payment_method,payment_status,name,surname,middlename,email,phone FROM ${this.tableVisitsName} AS v
  //   JOIN ${this.tableClientsName} AS c ON v.client_id = c.id_client `);
  //   console.log(result.rows);
  //   return result.rows;
  // }
  //
  // async selectVisitsClientsServices():Promise<any[]>  {
  //   const result = await this.db.query(`SELECT c.id_client, c.name AS client_name,
  //      c.surname AS client_surname, c.middlename AS client_middlename, c.email, c.phone, v.id_visit, v.date_time, v.alternative_date_time,
  //      v.note AS visit_note, v.payment_method, v.payment_status, s.id_service, s.name AS service_name, s.description, s.base_price,
  //      s.guarantee_period, s.average_duration FROM
  //   ${this.tableVisitsServicesName} AS sv
  //   JOIN ${this.tableVisitsName} AS v ON sv.visit_id = v.id_visit
  //   JOIN ${this.tableServicesName} AS s ON sv.service_id = s.id_service
  //   JOIN ${this.tableClientsName} AS c ON v.client_id = c.id_client
  //   ORDER BY c.id_client
  //   `);
  //   console.log(result);
  //   return result.rows;
  // }
  //
  // async createVisit(visitDto:CreateVisitDto){
  //   try{
  //     const query = `
  //     INSERT INTO ${this.tableVisitsName}
  //       (date_time, alternative_date_time, note, payment_method, payment_status, client_id)
  //     VALUES ($1, $2, $3, $4, $5, $6)
  //     RETURNING *;
  //   `;
  //     //RETURNING *; for returning what has just been added
  //
  //     const values = [
  //       visitDto.date_time,
  //       visitDto.alternative_date_time,
  //       visitDto.note,
  //       visitDto.payment_method,
  //       visitDto.payment_status,
  //       visitDto.client_id,
  //     ];
  //
  //     const result = await this.db.query(query, values);
  //
  //     await this.db.query(`INSERT INTO ${this.tableVisitsServicesName} (visit_id, service_id) VALUES ($1, $2)`, [result.rows[0].id_visit, visitDto.service_id]);
  //
  //     return result.rows[0];
  //   }
  //   catch(err){
  //     console.log('Error creating visit:',err.message);
  //   }
  // }
  //
  // async deleteVisit(id: number) {
  //   await this.db.query(`DELETE FROM ${this.tableVisitsName} WHERE id_visit = $1`, [id]);
  // }
  //
  // async getVisitById(id:number){
  //   const result = await this.db.query(`SELECT * FROM ${this.tableVisitsName}
  //        WHERE id_visit = $1;`,[id]);
  //   console.log(result.rows[0])
  //   return result.rows[0];
  // }
  //
  // async updateVisitById(id: number, dto: CreateVisitDto): Promise<any> {
  //   const query = `
  //   UPDATE ${this.tableVisitsName}
  //   SET
  //     date_time = $1,
  //     alternative_date_time = $2,
  //     note = $3,
  //     payment_method = $4,
  //     payment_status = $5,
  //     client_id = $6
  //   WHERE id_visit = $7
  //   RETURNING *;
  // `;
  //
  //   const values = [
  //     dto.date_time,
  //     dto.alternative_date_time,
  //     dto.note,
  //     dto.payment_method,
  //     dto.payment_status,
  //     dto.client_id,
  //     id,
  //   ];
  //
  //   const result = await this.db.query(query, values);
  //
  //   if (dto.service_id) {
  //     await this.db.query(
  //         `UPDATE ${this.tableVisitsServicesName}
  //      SET service_id = $1
  //      WHERE visit_id = $2`,
  //         [dto.service_id, id]
  //     );
  //   }
  //
  //   return result.rows[0];
  // }
}
