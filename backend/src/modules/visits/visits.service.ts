import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool, QueryResult } from "pg";
import { ConfigService } from "@nestjs/config";
import { findAllDataFromTable } from "../utils/database.utils";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { isArray } from "class-validator";
import PDFDocument from 'pdfkit';
import { Visit } from "../shared/interfaces/visit.interface";
import { Client } from "../shared/interfaces/client.interface";
import { Car } from "../shared/interfaces/car.interface";
import * as path from "node:path";
import { UpdateVisitDto } from "./dto/update-visit.dto";
import { UpdateVisitByAdminDto } from "./dto/update-vsit-by-admin";
import { MailService } from "../email/mail.service";


@Injectable()
export class VisitsService {
    private readonly tableClientsName: string;
    private readonly tableVisitsName: string;
    private readonly tableServicesName: string;
    private readonly tableVisitsServicesName: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService,
        private readonly mailService: MailService,
    ) {
        this.tableClientsName = this.configService.get<string>('TABLE_CLIENTS')!;
        this.tableVisitsName = this.configService.get<string>('TABLE_VISITS')!;
        this.tableServicesName = this.configService.get<string>('TABLE_SERVICES')!;
        this.tableVisitsServicesName = this.configService.get<string>('TABLE_VISITS_SERVICES')!;
    }


    async createVisit(dto: CreateVisitDto, user: any) {
        //get a client for transaction what guaranties transaction completes within one connection
        const client = await this.db.connect();
        let transactionCompleted = false;

        console.log("createVisit", user)

        let isNecessaryCreateClient = true;

        try {
            await client.query('BEGIN');

            if (dto.client_email && dto.client_name) {
                const findByEmailName = await client.query(
                    `SELECT client_id FROM Clients WHERE email = $1 AND name = $2`,
                    [dto.client_email, dto.client_name],
                );
                if (findByEmailName.rows.length > 0) {
                    let isSameClientError = true;
                    if (user?.id) {
                        for (let i = 0; i < findByEmailName.rows.length; i++) {
                            if (findByEmailName.rows[i].client_id == user.id) {
                                isNecessaryCreateClient = false;
                                isSameClientError = false;
                            }
                        }
                    }
                    if (isSameClientError)
                        throw new ConflictException(
                            `Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`
                        );
                }
            }
            else {
                throw new BadRequestException(
                    `Client email and name are required`
                );
            }

            let dbClientId;

            if (isNecessaryCreateClient) {
                const insertClient = await client.query(
                    `INSERT INTO Clients (name, surname, middlename, email, phone, login, password)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                     RETURNING client_id`,
                    [
                        dto.client_name || 'Unknown',
                        dto?.client_surname || null,
                        dto?.client_middlename || null,
                        dto?.client_email || null,
                        dto?.client_phone || null,
                        dto?.client_login || null,
                        dto?.client_password || null,
                    ],
                );
                dbClientId = insertClient.rows[0].client_id;
            }
            else {
                dbClientId = user.id;
            }


            let carId: number | null = null;

            if (dto.car_year)
                if (dto.car_year > new Date().getFullYear()) {
                    throw new BadRequestException('Рік автомобіля має бути у межах сучасного')
                }

            if (dto.car_vin || dto.car_licensePlate) {
                const findByVinLicensePlate = await client.query(
                    `SELECT car_id, client_id FROM cars WHERE license_plate = $1 OR vin = $2`,
                    [dto.car_licensePlate, dto.car_vin],
                );
                if (findByVinLicensePlate.rows.length > 0) {
                    let isSameCarError = true;
                    if (user?.id) {
                        console.log("isSameCarError", isSameCarError)
                        for (let i = 0; i < findByVinLicensePlate.rows.length; i++) {
                            console.log("isSameCarError", isSameCarError)

                            if (findByVinLicensePlate.rows[i].client_id == user.id) {
                                carId = findByVinLicensePlate.rows[i].car_id;
                                isSameCarError = false;
                                console.log("isSameCarError", isSameCarError)
                            }
                        }
                    }

                    if (isSameCarError)
                        throw new ConflictException(
                            `Car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`
                        );
                }
            }
            else {
                throw new BadRequestException(
                    `Car vin and license plate are required`
                );
            }

            let dbCarId;
            if (!carId) {
                const insertCar = await client.query(
                    `INSERT INTO Cars (brand, model, engine_type, year, license_plate, vin, client_id)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                     RETURNING car_id`,
                    [
                        dto.car_brand,
                        dto.car_model,
                        dto.car_engineType || null,
                        dto.car_year || null,
                        dto.car_licensePlate,
                        dto.car_vin,
                        dbClientId,
                    ],
                );

                dbCarId = insertCar.rows[0].car_id;
            }
            else {
                dbCarId = carId
            }

            if (!dto.visit_selectedDate && !dto.is_urgent) {
                throw new BadRequestException("Date of visit cannot be empty");
            }

            if (!dto.is_urgent && new Date(dto.visit_selectedDate!).getTime() < new Date().getTime()) {
                throw new BadRequestException("Дата візиту має бути від сьогодні");
            }
            //const visitDateTime = new Date(dto.visit_selectedDate);

            const insertVisit = await client.query(
                `INSERT INTO Visits (date_time, alternative_date_time, note, payment_way, payment_status, is_completed, car_id, autorepair_id,
                                     is_urgent)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     RETURNING visit_id`,
                [
                    dto.visit_selectedDate ? new Date(dto.visit_selectedDate) : null,
                    //visitDateTime,
                    dto.visit_selectedAlternativeDate ? new Date(dto.visit_selectedAlternativeDate) : null,
                    dto.visit_note ?? null,
                    'готівка',
                    'не оплачено',
                    dto.visit_isCompleted ?? false,
                    dbCarId,
                    dto.visit_autorepairId ?? null,
                    dto.is_urgent ?? false
                ],
            );
            const visitId = insertVisit.rows[0].visit_id;

            if (dto.visit_selectedServices && Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0) {
                for (const service of dto.visit_selectedServices) {
                    await client.query(
                        `INSERT INTO Visit_Services (problem_description, visit_id, autorepair_service_id)
                         VALUES ($1,$2,$3)`,
                        [null, visitId, service]
                    );
                }
            } else if (typeof dto.visit_selectedServices === 'string') {
                await client.query(
                    `INSERT INTO Visit_Services (problem_description, visit_id, autorepair_service_id)
                     VALUES ($1, $2, $3)`,
                    [dto.visit_selectedServices, visitId, null]
                );
            }

            await client.query('COMMIT');
            transactionCompleted = true;

            return { visitId, clientId: dbClientId, carId: dbCarId };

        } catch (err) {
            console.log(err)
            if (!transactionCompleted) {
                await client.query('ROLLBACK');
            }

            if (err.code === '23505') {
                const detail = err.detail || '';
                if (detail.includes('clients_name_email') || detail.includes('uq_client_name_email')) {
                    throw new ConflictException(
                        `Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`
                    );
                } else if (detail.includes('cars_license_plate') || detail.includes('cars_vin')) {
                    throw new BadRequestException(
                        `Car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`
                    );
                }
            }

            if (err instanceof BadRequestException || err instanceof ConflictException) {
                throw err;
            }

            throw new InternalServerErrorException(
                err.message || 'Database error during visit creation'
            );
        } finally {
            client.release();
        }
    }

    async updateVisit(
        visitId: number,
        dto: UpdateVisitDto,
        user: any
    ): Promise<{ visitId: number, clientId: number, carId: number }> {
        const client = await this.db.connect();
        let transactionCompleted = false;

        try {
            await client.query('BEGIN');

            const existingVisit = await client.query(
                `SELECT v.*, c.client_id, c.car_id 
             FROM Visits v
             JOIN Cars c ON v.car_id = c.car_id
             WHERE v.visit_id = $1`,
                [visitId]
            );

            if (existingVisit.rows.length === 0) {
                throw new BadRequestException(`Visit with ID ${visitId} not found`);
            }

            const visit = existingVisit.rows[0];

            if (user?.id && visit.client_id !== user.id) {
                throw new ForbiddenException('You can only update your own visits');
            }

            let dbClientId = visit.client_id;
            const dbCarId = dto.visit_carid ?? visit.car_id;

            if (dto.client_email || dto.client_name) {
                if (dto.client_email && dto.client_name) {
                    const existingClient = await client.query(
                        `SELECT client_id FROM Clients 
                     WHERE email = $1 AND name = $2 AND client_id != $3`,
                        [dto.client_email, dto.client_name, dbClientId]
                    );

                    if (existingClient.rows.length > 0) {
                        throw new ConflictException(
                            `Another client with email "${dto.client_email}" and name "${dto.client_name}" already exists`
                        );
                    }
                }

                const updateClientQuery = `
                UPDATE Clients 
                SET 
                    name = COALESCE($1, name),
                    surname = COALESCE($2, surname),
                    middlename = COALESCE($3, middlename),
                    email = COALESCE($4, email),
                    phone = COALESCE($5, phone),
                    login = COALESCE($6, login)
                WHERE client_id = $7
                RETURNING client_id
            `;

                const updatedClient = await client.query(updateClientQuery, [
                    dto.client_name,
                    dto.client_surname,
                    dto.client_middlename,
                    dto.client_email,
                    dto.client_phone,
                    dto.client_login,
                    dbClientId
                ]);

                dbClientId = updatedClient.rows[0].client_id;
            }

            if (dto.car_vin || dto.car_licensePlate) {
                if (dto.car_vin || dto.car_licensePlate) {
                    const existingCar = await client.query(
                        `SELECT car_id, client_id FROM Cars 
                     WHERE (license_plate = $1 OR vin = $2) 
                     AND car_id != $3`,
                        [dto.car_licensePlate, dto.car_vin, dbCarId]
                    );

                    if (existingCar.rows.length > 0) {
                        const otherCar = existingCar.rows[0];
                        if (user?.id && otherCar.client_id !== user.id) {
                            throw new ConflictException(
                                `Another car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`
                            );
                        }
                    }
                }

                //     const updateCarQuery = `
                //     UPDATE Cars
                //     SET
                //         brand = COALESCE($1, brand),
                //         model = COALESCE($2, model),
                //         engine_type = COALESCE($3, engine_type),
                //         year = COALESCE($4, year),
                //         license_plate = COALESCE($5, license_plate),
                //         vin = COALESCE($6, vin),
                //         client_id = COALESCE($7, client_id)
                //     WHERE car_id = $8 AND client_id = $9
                //     RETURNING car_id
                // `;
                //
                //     const updatedCar = await client.query(updateCarQuery, [
                //         dto.car_brand,
                //         dto.car_model,
                //         dto.car_engineType,
                //         dto.car_year,
                //         dto.car_licensePlate,
                //         dto.car_vin,
                //         dbClientId,
                //         dbCarId,
                //         dbClientId
                //     ]);
                //
                //     if (updatedCar.rows.length === 0) {
                //         throw new BadRequestException('Car does not belong to the client');
                //     }
                //
                //     dbCarId = updatedCar.rows[0].car_id;
            }

            const visitDateTime = dto.visit_selectedDate ? new Date(dto.visit_selectedDate) : null;
            const alternativeDateTime = dto.visit_selectedAlternativeDate
                ? new Date(dto.visit_selectedAlternativeDate)
                : null;

            const updateVisitQuery = `
            UPDATE Visits 
            SET 
                date_time = COALESCE($1, date_time),
                alternative_date_time = $2,
                note = COALESCE($3, note),
                payment_way = COALESCE($4, payment_way),
                payment_status = COALESCE($5, payment_status),
                is_completed = COALESCE($6, is_completed),
                car_id = $7,
                autorepair_id = COALESCE($8, autorepair_id)
            WHERE visit_id = $9
            RETURNING visit_id
            `;

            const updatedVisit = await client.query(updateVisitQuery, [
                visitDateTime,
                alternativeDateTime,
                dto.visit_note,
                dto.visit_paymentWay,
                dto.visit_paymentStatus,
                dto.visit_isCompleted,
                dbCarId,
                dto.visit_autorepairId,
                visitId
            ]);

            if (dto.visit_selectedServices !== undefined) {
                await client.query(
                    `DELETE FROM Visit_Services WHERE visit_id = $1`,
                    [visitId]
                );

                if (Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0) {
                    for (const service of dto.visit_selectedServices) {
                        await client.query(
                            `INSERT INTO Visit_Services (problem_description, visit_id, autorepair_service_id)
                         VALUES ($1, $2, $3)`,
                            [null, visitId, service]
                        );
                    }
                } else if (typeof dto.visit_selectedServices === 'string') {
                    await client.query(
                        `INSERT INTO Visit_Services (problem_description, visit_id, autorepair_service_id)
                     VALUES ($1, $2, $3)`,
                        [dto.visit_selectedServices, visitId, null]
                    );
                }
            }

            await client.query('COMMIT');
            transactionCompleted = true;

            return {
                visitId: updatedVisit.rows[0].visit_id,
                clientId: dbClientId,
                carId: dbCarId
            };

        } catch (err) {
            console.error(err);

            if (!transactionCompleted) {
                await client.query('ROLLBACK');
            }

            if (err.code === '23505') {
                const detail = err.detail || '';
                if (detail.includes('clients_name_email') || detail.includes('uq_client_name_email')) {
                    throw new ConflictException(
                        `Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`
                    );
                } else if (detail.includes('cars_license_plate')) {
                    throw new ConflictException(
                        `Car with license_plate "${dto.car_licensePlate}" already exists`
                    );
                } else if (detail.includes('cars_vin')) {
                    throw new ConflictException(
                        `Car with vin "${dto.car_vin}" already exists`
                    );
                }
            }

            if (err instanceof BadRequestException ||
                err instanceof ConflictException ||
                err instanceof NotFoundException ||
                err instanceof ForbiddenException) {
                throw err;
            }

            throw new InternalServerErrorException(
                err.message || 'Database error during visit update'
            );
        } finally {
            client.release();
        }
    }


    async getVisitReport(visitId: number, clientId: number, carId: number): Promise<Buffer> {
        const visit: QueryResult<Visit> = await this.db.query(`
        SELECT * FROM Visits WHERE visit_id = $1`, [visitId]);

        const client: QueryResult<Client> = await this.db.query(`
        SELECT * FROM Clients WHERE client_id = $1`, [clientId]);

        const car: QueryResult<Car> = await this.db.query(`
        SELECT * FROM Cars WHERE car_id = $1`, [carId]);


        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();

            console.log(__dirname);

            const fontPath = path.join(__dirname, "..", "..", "assets", "fonts", "DejaVuSans.ttf");
            doc.registerFont("custom", fontPath);
            doc.font("custom");

            const chunks: Buffer[] = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            // Заголовок
            doc.fontSize(24)
                .fillColor("#1e293b")
                .text("Підтвердження візиту", { align: "center" })
                .moveDown(1.5);

            // Секція клієнта
            doc.fontSize(16).fillColor("#0f172a").text("Інформація про клієнта", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(13).fillColor("#334155");
            doc.text(`ПІБ: ${client.rows[0].name || ""} ${client.rows[0].surname || ""}`);
            doc.text(`Email: ${client.rows[0].email || "—"}`);
            doc.text(`Телефон: ${client.rows[0].phone || "—"}`);
            doc.moveDown(1);

            // Лінія
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#cbd5e1").moveDown(1);

            // Секція візиту
            doc.fontSize(16).fillColor("#0f172a").text("Деталі візиту", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(13).fillColor("#334155");
            doc.text(`Дата візиту: ${visit.rows[0].date_time?.toLocaleString() || "—"}`);
            doc.text(`Альтернативна дата: ${visit.rows[0].alternative_date_time?.toLocaleString() || "—"}`);
            doc.text(`Примітка: ${visit.rows[0].note || "—"}`);
            doc.text(`Спосіб оплати: ${visit.rows[0].payment_way || "—"}`);
            doc.text(`Статус оплати: ${visit.rows[0].payment_status || "—"}`);
            doc.moveDown(1);

            // Лінія
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#cbd5e1").moveDown(1);

            // Секція авто
            doc.fontSize(16).fillColor("#0f172a").text("Автомобіль", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(13).fillColor("#334155");
            doc.text(`Марка: ${car.rows[0].brand}`);
            doc.text(`Модель: ${car.rows[0].model}`);
            doc.text(`Рік випуску: ${car.rows[0].year}`);
            doc.text(`Держ. номер: ${car.rows[0].license_plate}`);
            doc.text(`VIN: ${car.rows[0].vin}`);
            doc.moveDown(1);

            // Footer
            doc.fontSize(12)
                .fillColor("#64748b")
                .text(`Дата формування документа: ${new Date().toLocaleString()}`, { align: "right" });

            doc.end();
        });

    }

    async getVisitAutorepirs(visitId: number) {
        const relatedServices = await this.db.query(`
        SELECT ars.service_id 
        FROM Visit_Services vs
        JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
        WHERE vs.visit_id = $1
        `, [visitId]);
        return relatedServices.rows;
    }


    async getVisitAutorepairServicesById(visitId: number) {

        const visitQuery = await this.db.query(`
        SELECT *
        FROM Visits v
        WHERE v.visit_id = $1
    `, [visitId]);

        if (visitQuery.rows.length === 0) {
            throw new NotFoundException("Visit not found");
        }

        const visit = visitQuery.rows[0];

        const autorepairQuery = await this.db.query(`
        SELECT *
        FROM Autorepairs
        WHERE autorepair_id = $1
    `, [visit.autorepair_id]);

        const autorepair = autorepairQuery.rows[0];

        const selectedServicesQuery = await this.db.query(`
        SELECT 
            vs.visit_service_id,
            s.service_id,
            s.name,
            s.description,
            ars.autorepair_service_id
        FROM Visit_Services vs
        JOIN Autorepair_Services ars 
            ON ars.autorepair_service_id = vs.autorepair_service_id
        JOIN Services s 
            ON s.service_id = ars.service_id
        WHERE vs.visit_id = $1
    `, [visitId]);

        const selectedServices = selectedServicesQuery.rows;

        const problemDescriptionQuery = await this.db.query(`
        SELECT problem_description FROM VISIT_SERVICES
        WHERE VISIT_ID = $1`, [visitId])

        const problemDescription = problemDescriptionQuery.rows[0];

        const allAutorepairServicesQuery = await this.db.query(`
        SELECT 
            ars.autorepair_service_id,
            s.name
        FROM Autorepair_Services ars
        JOIN Services s ON s.service_id = ars.service_id
        WHERE ars.autorepair_id = $1
        ORDER BY s.name
    `, [visit.autorepair_id]);

        const allServices = allAutorepairServicesQuery.rows;



        return {
            visit,
            autorepair,
            selectedServices,
            problemDescription,
            allServices
        };
    }


    async updateVisitByIdSetCompleted(visitId: number, is_completed: boolean) {

        const result = await this.db.query(`
        UPDATE VISITS SET
            is_completed = $1
        WHERE visit_id = $2
        `, [is_completed, visitId])

        if (is_completed) {
            const client = await this.db.query(`
            SELECT 
                v.visit_id,
                v.date_time,
                v.is_urgent,

                c.brand,
                c.model,
                c.engine_type,
                c.year,
                c.license_plate,
                c.vin,

                cl.name AS client_name,
                cl.surname AS client_surname,
                cl.email AS client_email,

                ar.name AS autorepair_name,
                ar.adress AS autorepair_address,
                ar.phone AS autorepair_phone,

                s.name AS service_name,
                ars.service_price,
                ars.duration
            
            FROM CLIENTS CL
            INNER JOIN CARS C ON C.CLIENT_ID = CL.CLIENT_ID
            INNER JOIN VISITS V ON V.CAR_ID = C.CAR_ID
            LEFT JOIN Visit_Services vs ON v.visit_id = vs.visit_id
            LEFT JOIN Autorepairs ar ON v.autorepair_id = ar.autorepair_id
            LEFT JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            LEFT JOIN Services s ON ars.service_id = s.service_id
            WHERE V.VISIT_ID = $1
            `, [visitId])
            const email = client.rows[0]?.client_email;

            if (!email) {
                throw new BadRequestException('Email клієнта не знайдено');

            }

            const rows = client.rows;

            if (!rows.length) {
                throw new BadRequestException("Візит з клієнтом не знайдено");
            }

            // @ts-ignore
            const date = new Date(rows.date_time ?? new Date());

            const formattedDate =
                date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0');




            const servicesHtml = rows
                .filter(r => r.service_name)
                .map(r => `
            <li>
                ${r.service_name} — 
                ${r.service_price} грн — 
                ${r.duration} хв
            </li>
        `).join("");



            const html = `
        <h2>Ваш візит завершено ✅</h2>
        
        <p>Дякуємо, що звернулися до нашого автосервісу.</p>
        <p>Номер візиту: <b>${visitId}</b></p>
        <p>Автомайстерня скоро зв'яжиться з Вами щодо часу забирання автомобіля</p>

        <p><b>Дата:</b> ${formattedDate}</p>
        <p><b>Терміновий:</b> ${rows[0].is_urgent ? "Так" : "Ні"}</p>

        <hr/>

        <h3>👤 Клієнт</h3>
        <p>${rows[0].client_name} ${rows[0].client_surname ?? ""}</p>

        <h3>🚗 Автомобіль</h3>
        <ul>
            <li>Марка: ${rows[0].brand}</li>
            <li>Модель: ${rows[0].model}</li>
            <li>Двигун: ${rows[0].engine_type}</li>
            <li>Рік: ${rows[0].year}</li>
            <li>Номер: ${rows[0].license_plate}</li>
            <li>VIN: ${rows[0].vin}</li>
        </ul>

        <h3>🏢 Автомайстерня</h3>
        <ul>
            <li>Назва: ${rows[0].autorepair_name}</li>
            <li>Адреса: ${rows[0].autorepair_address}</li>
            <li>Телефон: ${rows[0].autorepair_phone}</li>
        </ul>

        <h3>🛠️ Обрані послуги</h3>
        <ul>
            ${servicesHtml || "<li>Послуги не вибрані</li>"}
        </ul>

        <br/>
        <p>Номер візиту: <b>${visitId}</b></p>
    `;


            await this.mailService.sendMail(
                email,
                'Ваш візит успішно завершено ✅',
                'Дякуємо, що скористались нашим сервісом!',
                html
            );
        }

    }



    async updateVisitDate(visitId: number, date_time: Date) {
        const result = await this.db.query(`
        UPDATE VISITS SET
            date_time = $1
        WHERE visit_id = $2
        `, [date_time, visitId])


        const visitData = await this.db.query(`
            SELECT
                v.visit_id,
                v.date_time,
                v.is_urgent,

                c.brand,
                c.model,
                c.engine_type,
                c.year,
                c.license_plate,
                c.vin,

                cl.name AS client_name,
                cl.surname AS client_surname,
                cl.email AS client_email,

                ar.name AS autorepair_name,
                ar.adress AS autorepair_address,
                ar.phone AS autorepair_phone,

                s.name AS service_name,
                ars.service_price,
                ars.duration

            FROM Visits v
                     INNER JOIN Cars c ON v.car_id = c.car_id
                     INNER JOIN Clients cl ON c.client_id = cl.client_id
                     LEFT JOIN Autorepairs ar ON v.autorepair_id = ar.autorepair_id

                     LEFT JOIN Visit_Services vs ON v.visit_id = vs.visit_id
                     LEFT JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
                     LEFT JOIN Services s ON ars.service_id = s.service_id

            WHERE v.visit_id = $1
        `, [visitId]);

        const rows = visitData.rows;

        if (!rows.length) {
            throw new BadRequestException("Візит не знайдено");
        }

        const clientEmail = rows[0].client_email;

        const date = new Date(date_time);

        const formattedDate =
            date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0') + ' ' +
            String(date.getHours()).padStart(2, '0') + ':' +
            String(date.getMinutes()).padStart(2, '0');




        const servicesHtml = rows
            .filter(r => r.service_name)
            .map(r => `
            <li>
                ${r.service_name} — 
                ${r.service_price} грн — 
                ${r.duration} хв
            </li>
        `).join("");



        const html = `
        <h2>✅ Ваш візит підтверджено</h2>

        <p><b>Дата:</b> ${formattedDate}</p>
        <p><b>Терміновий:</b> ${rows[0].is_urgent ? "Так" : "Ні"}</p>

        <hr/>

        <h3>👤 Клієнт</h3>
        <p>${rows[0].client_name} ${rows[0].client_surname ?? ""}</p>

        <h3>🚗 Автомобіль</h3>
        <ul>
            <li>Марка: ${rows[0].brand}</li>
            <li>Модель: ${rows[0].model}</li>
            <li>Двигун: ${rows[0].engine_type}</li>
            <li>Рік: ${rows[0].year}</li>
            <li>Номер: ${rows[0].license_plate}</li>
            <li>VIN: ${rows[0].vin}</li>
        </ul>

        <h3>🏢 Автомайстерня</h3>
        <ul>
            <li>Назва: ${rows[0].autorepair_name}</li>
            <li>Адреса: ${rows[0].autorepair_address}</li>
            <li>Телефон: ${rows[0].autorepair_phone}</li>
        </ul>

        <h3>🛠️ Обрані послуги</h3>
        <ul>
            ${servicesHtml || "<li>Послуги не вибрані</li>"}
        </ul>

        <br/>
        <p>Номер візиту: <b>${visitId}</b></p>
        <p>⏳ Очікуєм прибуття в зазначений час</p>
    `;

        await this.mailService.sendMail(
            clientEmail,
            `✅ Ваш візит №${visitId} підтверджено`,
            'Деталі вашого візиту',
            html
        );


        return result;
    }



    async findAllVisits(): Promise<any[]> {
        try {
            const result = await this.db.query(`SELECT
        v.*,
        COALESCE(json_agg(ars.service_id) FILTER (WHERE ars.service_id IS NOT NULL), '[]') AS services_ids FROM ${this.tableVisitsName} AS v
            LEFT JOIN ${this.tableVisitsServicesName} AS vs ON v.visit_id = vs.visit_id
            LEFT JOIN Autorepair_Services AS ars ON vs.autorepair_service_id = ars.autorepair_service_id
            GROUP BY v.visit_id
            ORDER BY v.visit_id;`);
            if (result.rows) return result.rows;
            else return [];
        }
        catch (error) {
            console.log(error);
            return [];
        }
    }

    async findAllVisitsClients(): Promise<any[]> {
        const result = await this.db.query(`SELECT v.VISIT_ID, date_time, alternative_date_time,
       note, payment_way, payment_status, is_completed, is_urgent ,CL.name,surname,middlename,email,phone FROM ${this.tableVisitsName} AS v
    JOIN cars AS c ON v.car_id = c.car_id
    JOIN CLIENTS CL ON CL.CLIENT_ID = C.CLIENT_ID`);
        return result.rows;
    }

    async selectVisitsClientsServices(): Promise<any[]> {
        const result = await this.db.query(`SELECT sv.visit_service_id, c.client_id, cL.name AS client_name,
       cL.surname AS client_surname, cL.middlename AS client_middlename, cL.email, cL.phone, v.visit_id, v.date_time, v.alternative_date_time,
       v.note AS visit_note, v.payment_WAY, v.payment_status, sv.autorepair_service_id, SER.name AS service_name, SER.description, s.service_price,
       s.garantie_term, s.duration FROM
    VISIT_SERVICES AS sv
    JOIN ${this.tableVisitsName} AS v ON sv.visit_id = v.visit_id
    JOIN Autorepair_Services AS s ON sv.autorepair_service_id = s.autorepair_service_id
    JOIN sERVICES AS SER ON s.service_id = SER.service_id
    JOIN cars AS c ON v.car_id = c.car_id
    JOIN CLIENTS CL ON CL.CLIENT_ID = C.CLIENT_ID
    ORDER BY c.client_id
    `);
        return result.rows;
    }


    async deleteVisit(id: number) {
        await this.db.query(`DELETE FROM ${this.tableVisitsName} WHERE visit_id = $1`, [id]);
    }

    async createVisitByAdmin(dto: any) {

        console.log("createVisitByAdmin", dto);

        const client = await this.db.connect();
        try {
            await client.query('BEGIN');

            const insertVisit = await client.query(
                `INSERT INTO ${this.tableVisitsName} (date_time, note, payment_way, payment_status, is_completed, is_urgent, car_id, autorepair_id, alternative_date_time)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                 RETURNING visit_id`,
                [
                    dto.date_time,
                    dto.note || null,
                    dto.payment_way,
                    dto.payment_status, // payment_status
                    dto.is_completed,
                    dto.is_urgent || false,
                    dto.car_id,
                    dto.autorepair_id || null,
                    dto.alternative_date_time
                ],
            );

            const visitId = insertVisit.rows[0].visit_id;

            if (dto.services_ids && dto.services_ids.length > 0) {
                for (const serviceId of dto.services_ids) {
                    if (!dto.autorepair_id) {
                        throw new BadRequestException("Autorepair is required to add services");
                    }

                    const findAutorepairService = await client.query(
                        `SELECT autorepair_service_id FROM Autorepair_Services WHERE autorepair_id = $1 AND service_id = $2`,
                        [dto.autorepair_id, serviceId]
                    );

                    let autorepairServiceId;

                    if (findAutorepairService.rows.length > 0) {
                        autorepairServiceId = findAutorepairService.rows[0].autorepair_service_id;
                    }
                    else {
                        const insertAutorepairService = await client.query(
                            `INSERT INTO Autorepair_Services (autorepair_id, service_id, price)
                                 VALUES ($1,$2,null)
                                 RETURNING autorepair_service_id`,
                            [dto.autorepair_id, serviceId]
                        );
                        autorepairServiceId = insertAutorepairService.rows[0].autorepair_service_id;
                    }

                    await client.query(
                        `INSERT INTO ${this.tableVisitsServicesName} (visit_id, autorepair_service_id)
                          VALUES ($1,$2)`,
                        [visitId, autorepairServiceId],
                    );
                }
            }

            await client.query('COMMIT');
            return { message: 'Visit created successfully' };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async updateVisitByAdmin(visitId: number, dto: any) {
        const client = await this.db.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                `UPDATE ${this.tableVisitsName}
                 SET date_time = $1,
                     note = $2,
                     is_urgent = $3,
                     car_id = $4,
                     autorepair_id = $5,
                     alternative_date_time = $6,
                     payment_way = $7,
                     payment_status = $8,
                     is_completed = $9
                 WHERE visit_id = $10`,
                [
                    dto.date_time,
                    dto.note || null,
                    dto.is_urgent || false,
                    dto.car_id,
                    dto.autorepair_id,
                    dto.alternative_date_time,
                    dto.payment_way,
                    dto.payment_status,
                    dto.is_completed,
                    visitId
                ]
            );

            await client.query(`DELETE FROM ${this.tableVisitsServicesName} WHERE visit_id = $1`, [visitId]);

            if (dto.services_ids && dto.services_ids.length > 0) {
                for (const serviceId of dto.services_ids) {
                    if (!dto.autorepair_id) {
                        throw new BadRequestException("Autorepair is required to add services");
                    }

                    const findAutorepairService = await client.query(
                        `SELECT autorepair_service_id FROM Autorepair_Services WHERE autorepair_id = $1 AND service_id = $2`,
                        [dto.autorepair_id, serviceId]
                    );

                    let autorepairServiceId;

                    if (findAutorepairService.rows.length > 0) {
                        autorepairServiceId = findAutorepairService.rows[0].autorepair_service_id;
                    } else {
                        const insertAutorepairService = await client.query(
                            `INSERT INTO Autorepair_Services (autorepair_id, service_id, price)
                             VALUES ($1,$2,null)
                             RETURNING autorepair_service_id`,
                            [dto.autorepair_id, serviceId]
                        );
                        autorepairServiceId = insertAutorepairService.rows[0].autorepair_service_id;
                    }

                    await client.query(
                        `INSERT INTO ${this.tableVisitsServicesName} (visit_id, autorepair_service_id)
                         VALUES ($1,$2)`,
                        [visitId, autorepairServiceId],
                    );
                }
            }

            await client.query('COMMIT');
            return { message: 'Visit updated successfully' };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}