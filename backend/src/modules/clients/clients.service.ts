import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hashPassword, validatePassword } from '../utils/passwords';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { Visit } from '../entities/visit.entity';
import { CreateClientDto } from './dto/add-client.dto';
import { CreateCarDto } from './dto/add-car.dto';
import { isDate } from 'class-validator';

@Injectable()
export class ClientService {
    private readonly salt: number;

    constructor(
        @InjectRepository(Client) private clientRepo: Repository<Client>,
        @InjectRepository(Car) private carRepo: Repository<Car>,
        @InjectRepository(Visit) private visitRepo: Repository<Visit>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.salt = this.configService.get<number>('SALT')!;
    }

    async register(createClientDto: CreateClientDto) {
        if (!createClientDto.login || !createClientDto.password || !createClientDto.email) {
            throw new BadRequestException('Invalid login or password or email');
        }

        return this.dataSource.transaction(async (manager) => {
            const existing = await manager.findOne(Client, {
                where: [
                    { email: createClientDto.email, name: 'UNKNOWN' },
                    { login: createClientDto.login },
                ],
            });

            if (existing) {
                throw new BadRequestException('Користувач з таким email, login вже існує');
            }

            const password = await hashPassword(createClientDto.password!, +this.salt);

            const client = manager.create(Client, {
                email: createClientDto.email,
                login: createClientDto.login,
                password,
            });

            await manager.save(client);
            return { message: 'Користувача успішно зареєстровано' };
        }).catch((err) => {
            if (err instanceof BadRequestException) throw err;
            console.error('Registration error:', err);
            throw new InternalServerErrorException('Помилка реєстрації');
        });
    }

    async validateUserByLogin(login: string, password: string) {
        const client = await this.clientRepo.findOne({
            where: { login },
            select: { clientId: true, password: true },
        });

        if (!client) {
            throw new BadRequestException('Користувача з таким логіном не існує');
        }

        const matchPasswords = await validatePassword(password, client.password!);

        if (!matchPasswords) {
            throw new UnauthorizedException('Неправильний пароль або логін');
        }

        return { client_id: client.clientId, password: client.password };
    }

    async createAccessToken(id: number, login: string): Promise<string> {
        const payload = { id, login };
        return this.jwtService.sign(payload, { expiresIn: '20m' });
    }

    async topActiveClients(count: number) {
        const result = await this.dataSource.query(`
            SELECT
                TRIM(COALESCE(cl.name, '') || ' ' || COALESCE(cl.surname, '')) as client_full_name,
                COUNT(DISTINCT v.visit_id) visits_count,
                COALESCE(SUM(ars.service_price), 0) total_spent,
                CASE
                    WHEN COUNT(DISTINCT v.visit_id) = 0 THEN 0
                    ELSE COALESCE(SUM(ars.service_price), 0) / COUNT(DISTINCT v.visit_id)
                END average_price_visit
            FROM clients cl
            JOIN cars c ON cl.client_id = c.client_id
            JOIN visits v ON c.car_id = v.car_id
            JOIN visit_services vs ON v.visit_id = vs.visit_id
            JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id AND v.autorepair_id = ars.autorepair_id
            WHERE v.is_completed = TRUE
            GROUP BY cl.client_id, cl.name, cl.surname
            ORDER BY total_spent DESC
            LIMIT $1
        `, [count]);
        return result;
    }

    async getVisitsByClientId(id: number) {
        const result = await this.dataSource.query(`
            SELECT V.*, C.*, A.name AUTOREPAIR_NAME, A.adress AUTOREPAIR_ADRESS,
                   A.phone AUTOREPAIR_PHONE, A.email autorepair_email
            FROM visits V
                     JOIN cars C ON V.car_id = C.car_id
                     JOIN autorepairs A ON A.autorepair_id = V.autorepair_id
            WHERE C.client_id = $1
            ORDER BY V.date_time DESC
        `, [id]);
        return result;
    }

    async getCarsByClientId(id: number) {
        const cars = await this.carRepo.find({
            where: { clientId: id },
            select: { carId: true, brand: true, model: true, engineType: true, year: true, insurance: true, licensePlate: true, vin: true },
        });

        return cars.map(car => ({
            car_id: car.carId,
            brand: car.brand,
            model: car.model,
            engine_type: car.engineType,
            year: car.year,
            insurance: car.insurance,
            license_plate: car.licensePlate,
            vin: car.vin
        }));
    }

    async addCarToClient(car: CreateCarDto, clientId: number) {
        if (car.insuranceExpiry && !isDate(new Date(car.insuranceExpiry))) {
            throw new BadRequestException('Формат дати не правильний');
        }

        return this.dataSource.transaction(async (manager) => {
            const existing = await manager.findOne(Car, {
                where: [{ licensePlate: car.licensePlate }, { vin: car.vin }],
            });

            if (existing) {
                throw new BadRequestException('Автомобіль з такими номером чи vin-кодом присутній');
            }

            const insuranceExpiry = car.insuranceExpiry === '' ? null : car.insuranceExpiry ?? null;

            const newCar = manager.create(Car, {
                brand: car.brand,
                model: car.model,
                engineType: car.engineType,
                year: car.year,
                insurance: insuranceExpiry ? new Date(insuranceExpiry) : null,
                licensePlate: car.licensePlate!,
                vin: car.vin!,
                clientId,
            });

            await manager.save(newCar);
        });
    }

    async createClient(createClientDto: CreateClientDto) {
        try {
            const existingByNameEmail = await this.clientRepo.findOne({
                where: { name: createClientDto.name, email: createClientDto.email },
            });

            if (existingByNameEmail) {
                throw new BadRequestException("Клієнт с такими параметрами існує задайте інше ім'я та email");
            }

            if (createClientDto.login) {
                const existingByLogin = await this.clientRepo.findOne({
                    where: { login: createClientDto.login },
                });
                if (existingByLogin) {
                    throw new BadRequestException('Клієнт с такими параметрами існує задайте іншмй login');
                }
            }

            let hashedPassword = null;
            if (createClientDto.password) {
                hashedPassword = await hashPassword(createClientDto.password, +this.salt);
            }

            const client = this.clientRepo.create({
                name: createClientDto.name,
                surname: createClientDto.surname ?? null,
                middlename: createClientDto.middlename ?? null,
                email: createClientDto.email,
                phone: createClientDto.phone ?? null,
                login: createClientDto.login ?? null,
                password: hashedPassword,
            });

            return await this.clientRepo.save(client);
        } catch (err: any) {
            if (err instanceof BadRequestException) throw err;
            console.log('Error creating client:', err.message);
        }
    }

    async findOneClientInfoById(id: number) {
        const result = await this.dataSource.query(`
            SELECT c.name AS client_name, c.surname AS client_surname,
                   c.middlename AS client_middlename, c.email, c.phone,
                   v.visit_id, v.date_time, v.alternative_date_time,
                   v.note AS visit_note, v.payment_way, v.payment_status,
                   s.name AS service_name, s.description
            FROM clients AS c
            LEFT JOIN visits AS v ON v.car_id IN (SELECT car_id FROM cars WHERE client_id = c.client_id)
            LEFT JOIN visit_services AS sv ON sv.visit_id = v.visit_id
            LEFT JOIN autorepair_services AS ars ON ars.autorepair_service_id = sv.autorepair_service_id
            LEFT JOIN services AS s ON ars.service_id = s.service_id
            WHERE c.client_id = $1
            ORDER BY v.visit_id
        `, [id]);
        return result;
    }

    async getClientById(id: number) {
        const client = await this.clientRepo.findOne({
            where: { clientId: id },
            select: { clientId: true, name: true, surname: true, middlename: true, email: true, phone: true, login: true },
        });

        console.log(client);

        if (!client) {
            throw new NotFoundException(`Client with id ${id} hasn't found`);
        }

        return client;
    }

    async deleteClient(id: number) {
        return this.clientRepo.delete({ clientId: id });
    }

    async update(id: number, dto: CreateClientDto) {
        const { name, surname, middlename, phone, email, login, password } = dto;

        const existing = await this.clientRepo.findOne({ where: { name: name!, email: email! } });
        if (existing && existing.clientId !== id) {
            throw new BadRequestException("Клієнт с такими параметрами існує задайте інше ім'я та email");
        }

        if (login) {
            const existingLogin = await this.clientRepo.findOne({ where: { login } });
            if (existingLogin && existingLogin.clientId !== id) {
                throw new BadRequestException('Клієнт с такими параметрами існує задайте іншмй login');
            }
        }

        const updateData: any = {
            name,
            surname: surname ?? undefined,
            middlename: middlename ?? undefined,
            phone: phone ?? undefined,
            email,
            login: login ?? undefined,
        };

        if (password) {
            updateData.password = await hashPassword(password, +this.salt);
        }

        return this.clientRepo.update({ clientId: id }, updateData);
    }

    async findAllClients() {
        const clients = await this.clientRepo.find();
        return clients.map(c => ({
            client_id: c.clientId,
            name: c.name,
            surname: c.surname,
            middlename: c.middlename,
            email: c.email,
            phone: c.phone,
            login: c.login
        }));
    }
}