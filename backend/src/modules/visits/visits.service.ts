import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { MailService } from '../email/mail.service';
import { Visit } from '../entities/visit.entity';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { VisitService as VisitServiceEntity } from '../entities/visit-service.entity';
import { AutorepairService as AutorepairServiceEntity } from '../entities/autorepair-service.entity';
import PDFDocument from 'pdfkit';
import * as path from 'node:path';

@Injectable()
export class VisitsService {
    constructor(
        @InjectRepository(Visit) private visitRepo: Repository<Visit>,
        @InjectRepository(Client) private clientRepo: Repository<Client>,
        @InjectRepository(Car) private carRepo: Repository<Car>,
        @InjectRepository(VisitServiceEntity) private visitServiceRepo: Repository<VisitServiceEntity>,
        @InjectRepository(AutorepairServiceEntity) private autorepairServiceRepo: Repository<AutorepairServiceEntity>,
        private readonly dataSource: DataSource,
        private readonly mailService: MailService,
    ) {}

    async createVisit(dto: CreateVisitDto, user: any) {
        console.log('createVisit', user);
        return this.dataSource.transaction(async (manager) => {
            let isNecessaryCreateClient = true;

            if (dto.client_email && dto.client_name) {
                const found = await manager.find(Client, {
                    where: { email: dto.client_email, name: dto.client_name },
                });
                if (found.length > 0) {
                    let isSameClientError = true;
                    if (user?.id) {
                        for (const c of found) {
                            if (c.clientId == user.id) {
                                isNecessaryCreateClient = false;
                                isSameClientError = false;
                            }
                        }
                    }
                    if (isSameClientError) {
                        throw new ConflictException(
                            `Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`,
                        );
                    }
                }
            } else {
                throw new BadRequestException('Client email and name are required');
            }

            let dbClientId: number;

            if (isNecessaryCreateClient) {
                const newClient = manager.create(Client, {
                    name: dto.client_name || 'Unknown',
                    surname: dto.client_surname ?? null,
                    middlename: dto.client_middlename ?? null,
                    email: dto.client_email ?? null,
                    phone: dto.client_phone ?? null,
                    login: dto.client_login ?? null,
                    password: dto.client_password ?? null,
                });
                const savedClient = await manager.save(newClient);
                dbClientId = savedClient.clientId;
            } else {
                dbClientId = user.id;
            }

            if (dto.car_year && dto.car_year > new Date().getFullYear()) {
                throw new BadRequestException('Рік автомобіля має бути у межах сучасного');
            }

            let carId: number | null = null;

            if (dto.car_vin || dto.car_licensePlate) {
                const existingCars = await manager.find(Car, {
                    where: [{ licensePlate: dto.car_licensePlate }, { vin: dto.car_vin }],
                });
                if (existingCars.length > 0) {
                    let isSameCarError = true;
                    if (user?.id) {
                        for (const c of existingCars) {
                            if (c.clientId == user.id) {
                                carId = c.carId;
                                isSameCarError = false;
                            }
                        }
                    }
                    if (isSameCarError) {
                        throw new ConflictException(
                            `Car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`,
                        );
                    }
                }
            } else {
                throw new BadRequestException('Car vin and license plate are required');
            }

            let dbCarId: number;
            if (!carId) {
                const newCar = manager.create(Car, {
                    brand: dto.car_brand,
                    model: dto.car_model,
                    engineType: dto.car_engineType ?? null,
                    year: dto.car_year ?? null,
                    licensePlate: dto.car_licensePlate!,
                    vin: dto.car_vin!,
                    clientId: dbClientId,
                });
                const savedCar = await manager.save(newCar);
                dbCarId = savedCar.carId;
            } else {
                dbCarId = carId;
            }

            if (!dto.visit_selectedDate && !dto.is_urgent) {
                throw new BadRequestException('Date of visit cannot be empty');
            }

            if (!dto.is_urgent && new Date(dto.visit_selectedDate!).getTime() < new Date().getTime()) {
                throw new BadRequestException('Дата візиту має бути від сьогодні');
            }

            const newVisit = manager.create(Visit, {
                dateTime: dto.visit_selectedDate ? new Date(dto.visit_selectedDate) : undefined,
                alternativeDateTime: dto.visit_selectedAlternativeDate
                    ? new Date(dto.visit_selectedAlternativeDate)
                    : undefined,
                note: dto.visit_note ?? undefined,
                paymentWay: 'готівка',
                paymentStatus: 'не оплачено',
                isCompleted: dto.visit_isCompleted !== undefined ? String(dto.visit_isCompleted) === 'true' : false,
                carId: dbCarId,
                autorepairId: dto.visit_autorepairId ? Number(dto.visit_autorepairId) : undefined,
                isUrgent: dto.is_urgent !== undefined ? String(dto.is_urgent) === 'true' : false,
            });
            const savedVisit = await manager.save(newVisit);
            const visitId = savedVisit.visitId;

            if (dto.visit_selectedServices && Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0) {
                for (const service of dto.visit_selectedServices) {
                    const vs = manager.create(VisitServiceEntity, {
                        problemDescription: null,
                        visitId,
                        autorepairServiceId: typeof service === 'number' ? service : null,
                    });
                    await manager.save(vs);
                }
            } else if (typeof dto.visit_selectedServices === 'string') {
                const vs = manager.create(VisitServiceEntity, {
                    problemDescription: dto.visit_selectedServices,
                    visitId,
                    autorepairServiceId: null,
                });
                await manager.save(vs);
            }

            return { visitId, clientId: dbClientId, carId: dbCarId };
        }).catch((err) => {
            if (err.code === '23505') {
                const detail = err.detail || '';
                if (detail.includes('clients_name_email') || detail.includes('uq_client_name_email')) {
                    throw new ConflictException(
                        `Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`,
                    );
                } else if (detail.includes('cars_license_plate') || detail.includes('cars_vin')) {
                    throw new BadRequestException(
                        `Car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`,
                    );
                }
            }
            if (
                err instanceof BadRequestException ||
                err instanceof ConflictException
            ) throw err;
            throw new InternalServerErrorException(err.message || 'Database error during visit creation');
        });
    }

    async updateVisit(
        visitId: number,
        dto: UpdateVisitDto,
        user: any,
    ): Promise<{ visitId: number; clientId: number; carId: number }> {
        return this.dataSource.transaction(async (manager) => {
            const existingVisit = await manager
                .createQueryBuilder(Visit, 'v')
                .innerJoin('v.car', 'c')
                .addSelect('c.clientId', 'clientId')
                .where('v.visitId = :visitId', { visitId })
                .getOne();

            if (!existingVisit) {
                throw new BadRequestException(`Visit with ID ${visitId} not found`);
            }

            const car = await manager.findOne(Car, { where: { carId: existingVisit.carId } });
            const clientId = car!.clientId;

            if (user?.id && clientId !== user.id) {
                throw new ForbiddenException('You can only update your own visits');
            }

            let dbClientId = clientId;
            const dbCarId = Number(dto.visit_carid ?? existingVisit.carId);

            if (dto.client_email || dto.client_name) {
                if (dto.client_email && dto.client_name) {
                    const conflictClient = await manager.findOne(Client, {
                        where: { email: dto.client_email, name: dto.client_name },
                    });
                    if (conflictClient && conflictClient.clientId !== dbClientId) {
                        throw new ConflictException(
                            `Another client with email "${dto.client_email}" and name "${dto.client_name}" already exists`,
                        );
                    }
                }
                await manager.update(Client, { clientId: dbClientId }, {
                    ...(dto.client_name && { name: dto.client_name }),
                    ...(dto.client_surname !== undefined && { surname: dto.client_surname }),
                    ...(dto.client_middlename !== undefined && { middlename: dto.client_middlename }),
                    ...(dto.client_email && { email: dto.client_email }),
                    ...(dto.client_phone !== undefined && { phone: dto.client_phone }),
                    ...(dto.client_login !== undefined && { login: dto.client_login }),
                });
            }

            if (dto.car_vin || dto.car_licensePlate) {
                const conflictCar = await manager.findOne(Car, {
                    where: [{ licensePlate: dto.car_licensePlate }, { vin: dto.car_vin }],
                });
                if (conflictCar && conflictCar.carId !== dbCarId) {
                    if (user?.id && conflictCar.clientId !== user.id) {
                        throw new ConflictException(
                            `Another car with license_plate "${dto.car_licensePlate}" or vin "${dto.car_vin}" already exists`,
                        );
                    }
                }
            }

            await manager.update(Visit, { visitId }, {
                ...(dto.visit_selectedDate && { dateTime: new Date(dto.visit_selectedDate) }),
                alternativeDateTime: dto.visit_selectedAlternativeDate
                    ? new Date(dto.visit_selectedAlternativeDate)
                    : undefined,
                ...(dto.visit_note !== undefined && { note: dto.visit_note }),
                ...(dto.visit_paymentWay && { paymentWay: dto.visit_paymentWay }),
                ...(dto.visit_paymentStatus && { paymentStatus: dto.visit_paymentStatus }),
                ...(dto.visit_isCompleted !== undefined && { isCompleted: String(dto.visit_isCompleted) === 'true' }),
                carId: dbCarId,
                ...(dto.visit_autorepairId && { autorepairId: Number(dto.visit_autorepairId) }),
            });

            if (dto.visit_selectedServices !== undefined) {
                await manager.delete(VisitServiceEntity, { visitId });

                if (Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0) {
                    for (const service of dto.visit_selectedServices) {
                        const vs = manager.create(VisitServiceEntity, {
                            problemDescription: null,
                            visitId,
                            autorepairServiceId: typeof service === 'number' ? service : null,
                        });
                        await manager.save(vs);
                    }
                } else if (typeof dto.visit_selectedServices === 'string') {
                    const vs = manager.create(VisitServiceEntity, {
                        problemDescription: dto.visit_selectedServices,
                        visitId,
                        autorepairServiceId: null,
                    });
                    await manager.save(vs);
                }
            }

            return { visitId, clientId: dbClientId, carId: dbCarId };
        }).catch((err) => {
            if (err.code === '23505') {
                const detail = err.detail || '';
                if (detail.includes('uq_client_name_email')) {
                    throw new ConflictException(`Client with email "${dto.client_email}" and name "${dto.client_name}" already exists`);
                } else if (detail.includes('cars_license_plate')) {
                    throw new ConflictException(`Car with license_plate "${dto.car_licensePlate}" already exists`);
                } else if (detail.includes('cars_vin')) {
                    throw new ConflictException(`Car with vin "${dto.car_vin}" already exists`);
                }
            }
            if (
                err instanceof BadRequestException ||
                err instanceof ConflictException ||
                err instanceof NotFoundException ||
                err instanceof ForbiddenException
            ) throw err;
            throw new InternalServerErrorException(err.message || 'Database error during visit update');
        });
    }

    async getVisitReport(visitId: number, clientId: number, carId: number): Promise<Buffer> {
        try {
            const visit = await this.visitRepo.findOneBy({ visitId });
            const client = await this.clientRepo.findOneBy({ clientId });
            const car = await this.carRepo.findOneBy({ carId });

            return new Promise((resolve, reject) => {
                const doc = new PDFDocument();
                const fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts', 'DejaVuSans.ttf');
                doc.registerFont('custom', fontPath);
                doc.font('custom');

                const chunks: Buffer[] = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                doc.fontSize(24).fillColor('#1e293b').text('Підтвердження візиту', { align: 'center' }).moveDown(1.5);

                doc.fontSize(16).fillColor('#0f172a').text('Інформація про клієнта', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(13).fillColor('#334155');
                doc.text(`ПІБ: ${client?.name || ''} ${client?.surname || ''}`);
                doc.text(`Email: ${client?.email || '—'}`);
                doc.text(`Телефон: ${client?.phone || '—'}`);
                doc.moveDown(1);

                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cbd5e1').moveDown(1);

                doc.fontSize(16).fillColor('#0f172a').text('Деталі візиту', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(13).fillColor('#334155');
                doc.text(`Дата візиту: ${visit?.dateTime?.toLocaleString() || '—'}`);
                doc.text(`Альтернативна дата: ${visit?.alternativeDateTime?.toLocaleString() || '—'}`);
                doc.text(`Примітка: ${visit?.note || '—'}`);
                doc.text(`Спосіб оплати: ${visit?.paymentWay || '—'}`);
                doc.text(`Статус оплати: ${visit?.paymentStatus || '—'}`);
                doc.moveDown(1);

                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cbd5e1').moveDown(1);

                doc.fontSize(16).fillColor('#0f172a').text('Автомобіль', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(13).fillColor('#334155');
                doc.text(`Марка: ${car?.brand}`);
                doc.text(`Модель: ${car?.model}`);
                doc.text(`Рік випуску: ${car?.year}`);
                doc.text(`Держ. номер: ${car?.licensePlate}`);
                doc.text(`VIN: ${car?.vin}`);
                doc.moveDown(1);

                doc.fontSize(12).fillColor('#64748b').text(`Дата формування документа: ${new Date().toLocaleString()}`, { align: 'right' });

                doc.end();
            });
        } catch (error) {
            console.error("Error in getVisitReport: ", error);
            throw error;
        }
    }

    async getVisitAutorepirs(visitId: number) {
        const result = await this.dataSource.query(`
            SELECT ars.service_id
            FROM Visit_Services vs
            JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            WHERE vs.visit_id = $1
        `, [visitId]);
        return result;
    }

    async getVisitAutorepairServicesById(visitId: number) {
        const visit = await this.visitRepo.findOneBy({ visitId });
        if (!visit) throw new NotFoundException('Visit not found');

        const autorepairQuery = await this.dataSource.query(`
            SELECT * FROM Autorepairs WHERE autorepair_id = $1
        `, [visit.autorepairId]);
        const autorepair = autorepairQuery[0];

        const selectedServices = await this.dataSource.query(`
            SELECT vs.visit_service_id, s.service_id, s.name, s.description, ars.autorepair_service_id
            FROM Visit_Services vs
            JOIN Autorepair_Services ars ON ars.autorepair_service_id = vs.autorepair_service_id
            JOIN Services s ON s.service_id = ars.service_id
            WHERE vs.visit_id = $1
        `, [visitId]);

        const problemDescriptionQuery = await this.dataSource.query(`
            SELECT problem_description FROM visit_services WHERE visit_id = $1
        `, [visitId]);
        const problemDescription = problemDescriptionQuery[0];

        const allServices = await this.dataSource.query(`
            SELECT ars.autorepair_service_id, s.name
            FROM Autorepair_Services ars
            JOIN Services s ON s.service_id = ars.service_id
            WHERE ars.autorepair_id = $1
            ORDER BY s.name
        `, [visit.autorepairId]);
        
        const mappedVisit = {
            visit_id: visit.visitId,
            date_time: visit.dateTime,
            alternative_date_time: visit.alternativeDateTime,
            note: visit.note,
            payment_way: visit.paymentWay,
            payment_status: visit.paymentStatus,
            is_completed: visit.isCompleted,
            is_urgent: visit.isUrgent,
            car_id: visit.carId,
            autorepair_id: visit.autorepairId
        };

        return { visit: mappedVisit, autorepair, selectedServices, problemDescription, allServices };
    }

    async updateVisitByIdSetCompleted(visitId: number, is_completed: boolean) {
        await this.visitRepo.update({ visitId }, { isCompleted: is_completed });

        if (is_completed) {
            const rows = await this.dataSource.query(`
                SELECT
                    v.visit_id, v.date_time, v.is_urgent,
                    c.brand, c.model, c.engine_type, c.year, c.license_plate, c.vin,
                    cl.name AS client_name, cl.surname AS client_surname, cl.email AS client_email,
                    ar.name AS autorepair_name, ar.adress AS autorepair_address, ar.phone AS autorepair_phone,
                    s.name AS service_name, ars.service_price, ars.duration
                FROM clients cl
                INNER JOIN cars c ON c.client_id = cl.client_id
                INNER JOIN visits v ON v.car_id = c.car_id
                LEFT JOIN visit_services vs ON v.visit_id = vs.visit_id
                LEFT JOIN autorepairs ar ON v.autorepair_id = ar.autorepair_id
                LEFT JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id
                LEFT JOIN services s ON ars.service_id = s.service_id
                WHERE v.visit_id = $1
            `, [visitId]);

            const email = rows[0]?.client_email;
            if (!email) throw new BadRequestException('Email клієнта не знайдено');
            if (!rows.length) throw new BadRequestException('Візит з клієнтом не знайдено');

            const date = new Date(rows[0].date_time ?? new Date());
            const formattedDate = this._formatDate(date);

            const servicesHtml = rows
                .filter((r: any) => r.service_name)
                .map((r: any) => `<li>${r.service_name} — ${r.service_price} грн — ${r.duration} хв</li>`)
                .join('');

            const html = `
                <h2>Ваш візит завершено ✅</h2>
                <p>Дякуємо, що звернулися до нашого автосервісу.</p>
                <p>Номер візиту: <b>${visitId}</b></p>
                <p><b>Дата:</b> ${formattedDate}</p>
                <p><b>Терміновий:</b> ${rows[0].is_urgent ? 'Так' : 'Ні'}</p>
                <hr/>
                <h3>👤 Клієнт</h3>
                <p>${rows[0].client_name} ${rows[0].client_surname ?? ''}</p>
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
                <ul>${servicesHtml || '<li>Послуги не вибрані</li>'}</ul>
                <p>Номер візиту: <b>${visitId}</b></p>
            `;

            await this.mailService.sendMail(email, 'Ваш візит успішно завершено ✅', 'Дякуємо, що скористались нашим сервісом!', html);
        }
    }

    async updateVisitDate(visitId: number, date_time: Date) {
        await this.visitRepo.update({ visitId }, { dateTime: date_time });

        const rows = await this.dataSource.query(`
            SELECT
                v.visit_id, v.date_time, v.is_urgent,
                c.brand, c.model, c.engine_type, c.year, c.license_plate, c.vin,
                cl.name AS client_name, cl.surname AS client_surname, cl.email AS client_email,
                ar.name AS autorepair_name, ar.adress AS autorepair_address, ar.phone AS autorepair_phone,
                s.name AS service_name, ars.service_price, ars.duration
            FROM visits v
            INNER JOIN cars c ON v.car_id = c.car_id
            INNER JOIN clients cl ON c.client_id = cl.client_id
            LEFT JOIN autorepairs ar ON v.autorepair_id = ar.autorepair_id
            LEFT JOIN visit_services vs ON v.visit_id = vs.visit_id
            LEFT JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id
            LEFT JOIN services s ON ars.service_id = s.service_id
            WHERE v.visit_id = $1
        `, [visitId]);

        if (!rows.length) throw new BadRequestException('Візит не знайдено');

        const clientEmail = rows[0].client_email;
        const date = new Date(date_time);
        const formattedDate = this._formatDate(date);

        const servicesHtml = rows
            .filter((r: any) => r.service_name)
            .map((r: any) => `<li>${r.service_name} — ${r.service_price} грн — ${r.duration} хв</li>`)
            .join('');

        const html = `
            <h2>✅ Ваш візит підтверджено</h2>
            <p><b>Дата:</b> ${formattedDate}</p>
            <p><b>Терміновий:</b> ${rows[0].is_urgent ? 'Так' : 'Ні'}</p>
            <hr/>
            <h3>👤 Клієнт</h3>
            <p>${rows[0].client_name} ${rows[0].client_surname ?? ''}</p>
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
            <ul>${servicesHtml || '<li>Послуги не вибрані</li>'}</ul>
            <p>Номер візиту: <b>${visitId}</b></p>
            <p>⏳ Очікуєм прибуття в зазначений час</p>
        `;

        if (clientEmail) {
            try {
                await this.mailService.sendMail(
                    clientEmail,
                    `✅ Ваш візит №${visitId} підтверджено`,
                    'Деталі вашого візиту',
                    html,
                );
            } catch (e) {
                console.error('Failed to send confirmation email:', e);
            }
        }
    }

    async findAllVisits(): Promise<any[]> {
        try {
            const result = await this.dataSource.query(`
                SELECT v.*,
                    COALESCE(json_agg(ars.service_id) FILTER (WHERE ars.service_id IS NOT NULL), '[]') AS services_ids
                FROM visits AS v
                LEFT JOIN visit_services AS vs ON v.visit_id = vs.visit_id
                LEFT JOIN Autorepair_Services AS ars ON vs.autorepair_service_id = ars.autorepair_service_id
                GROUP BY v.visit_id
                ORDER BY v.visit_id
            `);
            return result ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findAllVisitsClients(): Promise<any[]> {
        const result = await this.dataSource.query(`
            SELECT v.visit_id, date_time, alternative_date_time,
                   note, payment_way, payment_status, is_completed, is_urgent,
                   cl.name, surname, middlename, email, phone
            FROM visits AS v
            JOIN cars AS c ON v.car_id = c.car_id
            JOIN clients cl ON cl.client_id = c.client_id
        `);
        return result;
    }

    async selectVisitsClientsServices(): Promise<any[]> {
        const result = await this.dataSource.query(`
            SELECT sv.visit_service_id, c.client_id, cl.name AS client_name,
                   cl.surname AS client_surname, cl.middlename AS client_middlename,
                   cl.email, cl.phone, v.visit_id, v.date_time, v.alternative_date_time,
                   v.note AS visit_note, v.payment_way, v.payment_status,
                   sv.autorepair_service_id, ser.name AS service_name, ser.description,
                   s.service_price, s.garantie_term, s.duration
            FROM visit_services AS sv
            JOIN visits AS v ON sv.visit_id = v.visit_id
            JOIN autorepair_services AS s ON sv.autorepair_service_id = s.autorepair_service_id
            JOIN services AS ser ON s.service_id = ser.service_id
            JOIN cars AS c ON v.car_id = c.car_id
            JOIN clients cl ON cl.client_id = c.client_id
            ORDER BY c.client_id
        `);
        return result;
    }

    async deleteVisit(id: number) {
        await this.visitRepo.delete({ visitId: id });
    }

    async createVisitByAdmin(dto: any) {
        console.log('createVisitByAdmin', dto);

        return this.dataSource.transaction(async (manager) => {
            const newVisit = manager.create(Visit, {
                dateTime: dto.date_time,
                note: dto.note || null,
                paymentWay: dto.payment_way,
                paymentStatus: dto.payment_status,
                isCompleted: dto.is_completed,
                isUrgent: dto.is_urgent || false,
                carId: dto.car_id,
                autorepairId: dto.autorepair_id || null,
                alternativeDateTime: dto.alternative_date_time,
            });
            const savedVisit = await manager.save(newVisit);
            const visitId = savedVisit.visitId;

            if (dto.services_ids && dto.services_ids.length > 0) {
                for (const serviceId of dto.services_ids) {
                    if (!dto.autorepair_id) throw new BadRequestException('Autorepair is required to add services');

                    let arsEntity = await manager.findOne(AutorepairServiceEntity, {
                        where: { autorepairId: dto.autorepair_id, serviceId },
                    });

                    if (!arsEntity) {
                        // Cannot insert without price/duration (NOT NULL constraints), skip
                        continue;
                    }

                    const vs = manager.create(VisitServiceEntity, {
                        visitId,
                        autorepairServiceId: arsEntity.autorepairServiceId,
                    });
                    await manager.save(vs);
                }
            }

            return { message: 'Visit created successfully' };
        });
    }

    async updateVisitByAdmin(visitId: number, dto: any) {
        return this.dataSource.transaction(async (manager) => {
            await manager.update(Visit, { visitId }, {
                dateTime: dto.date_time,
                note: dto.note || null,
                isUrgent: dto.is_urgent || false,
                carId: dto.car_id,
                autorepairId: dto.autorepair_id,
                alternativeDateTime: dto.alternative_date_time,
                paymentWay: dto.payment_way,
                paymentStatus: dto.payment_status,
                isCompleted: dto.is_completed,
            });

            await manager.delete(VisitServiceEntity, { visitId });

            if (dto.services_ids && dto.services_ids.length > 0) {
                for (const serviceId of dto.services_ids) {
                    if (!dto.autorepair_id) throw new BadRequestException('Autorepair is required to add services');

                    let arsEntity = await manager.findOne(AutorepairServiceEntity, {
                        where: { autorepairId: dto.autorepair_id, serviceId },
                    });

                    if (!arsEntity) continue;

                    const vs = manager.create(VisitServiceEntity, {
                        visitId,
                        autorepairServiceId: arsEntity.autorepairServiceId,
                    });
                    await manager.save(vs);
                }
            }

            return { message: 'Visit updated successfully' };
        });
    }

    private _formatDate(date: Date): string {
        return (
            date.getFullYear() +
            '-' +
            String(date.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(date.getDate()).padStart(2, '0') +
            ' ' +
            String(date.getHours()).padStart(2, '0') +
            ':' +
            String(date.getMinutes()).padStart(2, '0')
        );
    }
}