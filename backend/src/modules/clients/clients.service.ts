import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { findAllDataFromTable } from '../utils/database.utils';
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { CreateClientDto } from "./dto/add-client.dto";
import { getCustomTransformers } from "ts-loader/dist/instances";
import { CreateServiceDto } from "../services/add-service.dto";
import * as bcrypt from 'bcrypt';
import { hashPassword, validatePassword } from "../utils/passwords";
import { JwtService } from "@nestjs/jwt";
import { CreateCarDto } from "./dto/add-car.dto";
import { isDate } from "class-validator";



@Injectable()
export class ClientService {

    private readonly tableClientsName: string;
    private readonly tableVisitsName: string;
    private readonly tableServicesName: string;
    private readonly tableVisitsServicesName: string;
    private readonly tableCars: string;
    private readonly tableAutorepairs: string;
    private readonly salt: number;


    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        this.tableClientsName = this.configService.get<string>('TABLE_CLIENTS')!;
        this.tableVisitsName = this.configService.get<string>('TABLE_VISITS')!;
        this.tableServicesName = this.configService.get<string>('TABLE_SERVICES')!;
        this.tableVisitsServicesName = this.configService.get<string>('TABLE_VISITS_SERVICES')!;
        this.tableCars = this.configService.get<string>('TABLE_CARS')!;
        this.tableAutorepairs = this.configService.get<string>('TABLE_AUTOREPAIRS')!;
        this.salt = this.configService.get<number>('SALT')!;
    }


    async register(createClientDto: CreateClientDto) {
        const client = await this.db.connect();
        let transactionCompleted = false;

        if (!createClientDto.login || !createClientDto.password || !createClientDto.login) {
            throw new BadRequestException("Invalid login or password or email");
        }

        try {
            await client.query('BEGIN');

            const clientResult = await client.query(`SELECT client_id FROM Clients 
                 WHERE (EMAIL = $1 AND NAME = 'UNKNOWN') OR LOGIN = $2`, [createClientDto.email, createClientDto.login])
            if (clientResult.rows.length > 0) {
                throw new BadRequestException('Користувач з таким email, login вже існує');
            }

            const password = await hashPassword(createClientDto.password, +this.salt);

            await client.query(`INSERT INTO ${this.tableClientsName} (email, login, password) VALUES
                                        ($1, $2, $3)`, [createClientDto.email,
            createClientDto.login, password]);

            await client.query('COMMIT');
            transactionCompleted = true;
            return { message: 'Користувача успішно зареєстровано' };
        }
        catch (error) {
            await client.query('ROLLBACK');

            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new InternalServerErrorException('Помилка реєстрації');
        }
        finally {
            client.release();
        }
    }


    async validateUserByLogin(login: string, password: string) {
        const result = await this.db.query(`SELECT client_id, password FROM ${this.tableClientsName}
        WHERE LOGIN = $1`, [login]);

        if (!result.rows.length) {
            throw new BadRequestException("Користувача з таким логіном не існує");
        }

        const matchPasswords = await validatePassword(password, result.rows[0].password)

        if (!matchPasswords) {
            throw new UnauthorizedException("Неправильний пароль або логін");
        }

        return result.rows[0];


    }


    async createAccessToken(id: number, login: string): Promise<string> {
        const payload = { id, login };

        return this.jwtService.sign(payload, {
            expiresIn: "20m",
        });
    }



    async topActiveClients(count: number) {
        const result = await this.db.query(`
        SELECT
            cl.name || ' ' || cl.surname client_full_name,
    COUNT(DISTINCT v.visit_id) visits_count,
    COALESCE(SUM(ars.service_price), 0) total_spent,
    CASE
        WHEN COUNT(DISTINCT v.visit_id) = 0 THEN 0
        ELSE COALESCE(SUM(ars.service_price), 0) / COUNT(DISTINCT v.visit_id)
        END average_price_visit
FROM Clients cl
JOIN Cars c ON cl.client_id = c.client_id
JOIN Visits v ON c.car_id = v.car_id
JOIN Visit_Services vs ON v.visit_id = vs.visit_id
JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id AND v.autorepair_id = ars.autorepair_id
WHERE v.is_completed = TRUE
AND v.date_time >= CURRENT_DATE - 30
GROUP BY cl.client_id, cl.name, cl.surname
ORDER BY total_spent DESC
LIMIT $1;`, [count]);
        return result.rows;
    }

    async getVisitsByClientId(id: number) {
        const result = await this.db.query(`
            SELECT V.*, C.*, A.name AUTOREPAIR_NAME, A.adress AUTOREPAIR_ADRESS,
                   A.phone AUTOREPAIR_PHONE, A.email autorepair_email
            FROM ${this.tableVisitsName} V
                     JOIN ${this.tableCars} C ON V.car_id = C.car_id
            JOIN ${this.tableAutorepairs} A ON A.autorepair_id = V.autorepair_id
            WHERE C.client_id = $1
            ORDER BY V.date_time DESC
        `, [id])
        return result.rows;
    }


    async getCarsByClientId(id: number) {
        const result = await this.db.query(`
        SELECT car_id, brand, model, engine_type, year, insurance, license_plate, vin FROM CARS C
        WHERE C.CLIENT_ID = $1
        `, [id]);

        return result.rows;
    }


    async addCarToClient(car: CreateCarDto, clientId: number) {
        const client = await this.db.connect();

        if (car.insuranceExpiry)
            if (!isDate(new Date(car.insuranceExpiry)))
                throw new BadRequestException("Формат дати не правильний")

        try {
            await client.query('BEGIN');

            const carsWithSameUnique = await client.query(`
            SELECT CAR_ID FROM CARS 
            WHERE license_plate = $1 OR vin = $2`, [car.licensePlate, car.vin])

            if (carsWithSameUnique.rows.length)
                throw new BadRequestException('Автомобіль з такими номером чи vin-кодом присутній')

            const insuranceExpiry = car.insuranceExpiry === '' ? null : car.insuranceExpiry;
            await client.query(`
            INSERT INTO CARS (BRAND, MODEL, engine_type, YEAR, insurance, license_plate, VIN, CLIENT_ID)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8)`, [car.brand, car.model, car.engineType, car.year,
                insuranceExpiry, car.licensePlate, car.vin, clientId])


            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK')
            throw err
        }
    }







    async createClient(createClientDto: CreateClientDto) {
        try {

            const resultCheck = await this.db.query(`
        SELECT CLIENT_ID FROM CLIENTS WHERE name = $1 AND EMAIL = $2;
        `, [createClientDto.name, createClientDto.email])

            if (resultCheck.rows.length > 0) {
                throw new BadRequestException("Клієнт с такими параметрами існує задайте інше ім'я та email")
            }

            const checkLogin = await this.db.query(`
        SELECT CLIENT_ID FROM CLIENTS WHERE LOGIN = $1`, [createClientDto.login])

            if (checkLogin.rows.length > 0) {
                throw new BadRequestException("Клієнт с такими параметрами існує задайте іншмй login")
            }

            const query = `
      INSERT INTO ${this.tableClientsName} 
        (name, surname, middlename, email, phone, login) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
            const values = [
                createClientDto.name,
                createClientDto.surname,
                createClientDto.middlename,
                createClientDto.email,
                createClientDto.phone,
                createClientDto.login,
            ];

            const result = await this.db.query(query, values);
            return result.rows[0];
        }
        catch (err) {
            console.log('Error creating client:', err.message);
        }
    }

    async findOneClientInfoById(id: number) {
        const query = `SELECT c.name AS client_name, c.surname AS client_surname,
        c.middlename AS client_middlename, c.email, c.phone, v.id_visit, v.date_time,
        v.alternative_date_time, v.note AS visit_note, v.payment_method, v.payment_status,
        s.name AS service_name, s.description, s.base_price, s.guarantee_period, s.average_duration
        FROM ${this.tableClientsName} AS c
        LEFT JOIN ${this.tableVisitsName} AS v ON v.client_id = c.id_client
        LEFT JOIN ${this.tableVisitsServicesName} AS sv ON sv.visit_id = v.id_visit
        LEFT JOIN ${this.tableServicesName} AS s ON sv.service_id = s.id_service
        WHERE c.id_client = $1
        ORDER BY v.id_visit
        `;
        const result = await this.db.query(query, [id]);
        return result.rows;
    }

    async getClientById(id: number) {
        const result = await this.db.query(`SELECT client_id, name, surname,
                                                   middlename, email, phone, login FROM ${this.tableClientsName} 
         WHERE client_id = $1;`, [id]);
        console.log(result.rows[0])

        if (!result) {
            throw new NotFoundException(`Client with id ${id} hasn't found`);
        }

        return result.rows[0];
    }

    async deleteClient(id: number) {
        return await this.db.query(`DELETE FROM ${this.tableClientsName} WHERE client_id = $1`, [id]);
    }

    async update(id: number, dto: CreateClientDto) {
        const { name, surname, middlename, phone, email, login } = dto;

        const result = await this.db.query(`
        SELECT CLIENT_ID FROM CLIENTS WHERE name = $1 AND EMAIL = $2;
        `, [name, email])

        if (result.rows.length > 0) {
            throw new BadRequestException("Клієнт с такими параметрами існує задайте інше ім'я та email")
        }

        const checkLogin = await this.db.query(`
        SELECT CLIENT_ID FROM CLIENTS WHERE LOGIN = $1`, [login])

        if (checkLogin.rows.length > 0) {
            throw new BadRequestException("Клієнт с такими параметрами існує задайте іншмй login")
        }

        return await this.db.query(
            `UPDATE ${this.tableClientsName}
       SET name = $1, surname = $2, middlename = $3,
           phone = $4, email = $5, login = $6
       WHERE client_id = $7`,
            [name, surname, middlename, phone, email, login, id]
        );
    }

    async findAllClients() {
        return await findAllDataFromTable(this.db, this.tableClientsName);
    }
}