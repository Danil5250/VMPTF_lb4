import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Autorepair } from '../entities/autorepair.entity';
import { Visit } from '../entities/visit.entity';
import { RetrieveAutorepairOptions } from './dto/retrieve-autorepairs-options.dto';
import PDFDocument from 'pdfkit';
import * as path from 'node:path';

@Injectable()
export class AutorepairService {
    constructor(
        @InjectRepository(Autorepair) private autorepairRepo: Repository<Autorepair>,
        @InjectRepository(Visit) private visitRepo: Repository<Visit>,
        private readonly dataSource: DataSource,
    ) {}

    async getAllAutorepairs() {
        const result = await this.autorepairRepo.find({
            select: { autorepairId: true, name: true },
            order: { name: 'ASC' },
        });
        return result.map(a => ({
            autorepair_id: a.autorepairId,
            name: a.name
        }));
    }

    async getAutorepairs(options: Partial<RetrieveAutorepairOptions> = {}) {
        const {
            name,
            city,
            specialization,
            workingDays,
            sortBy = 'name',
            sortOrder = 'ASC',
            limit = '5',
            offset = '0',
        } = options;

        const params: any[] = [];
        const where: string[] = [];

        if (name) {
            params.push(`%${name.toLowerCase()}%`);
            where.push(`(LOWER(a.name) LIKE $${params.length})`);
        }

        if (city) {
            params.push(`%${city.toLowerCase()}%`);
            where.push(`LOWER(a.adress) LIKE $${params.length}`);
        }

        if (specialization && specialization.length > 0) {
            const placeholders = specialization.map((_, i) => `$${params.length + i + 1}`);
            params.push(...specialization);
            where.push(`s.name IN (${placeholders.join(', ')})`);
        }

        let workingDaysJoin = '';
        if (workingDays && workingDays.length > 0) {
            const workingDaysPlaceholders = workingDays.map((_, i) => `$${params.length + i + 1}`);
            params.push(...workingDays);
            workingDaysJoin = `INNER JOIN (
                SELECT autorepair_id
                FROM Schedule_Workings
                WHERE day_of_week IN (${workingDaysPlaceholders.join(', ')})
                GROUP BY autorepair_id
                HAVING COUNT(DISTINCT day_of_week) = ${workingDays.length}
            ) filtered_sw ON a.autorepair_id = filtered_sw.autorepair_id`;
        }

        const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const validSort: Record<string, string> = {
            name: 'a.name',
            ranking: 'a.ranking',
            workers_amount: 'a.workers_amount',
            working_days: 'MIN(sw.day_of_week)',
        };
        const orderColumn = validSort[sortBy] || 'a.name';
        const orderSQL = sortOrder === 'DESC' ? 'DESC' : 'ASC';

        params.push(Number(limit));
        const limitIndex = params.length;
        params.push(Number(offset));
        const offsetIndex = params.length;

        const query = `
            SELECT
                a.autorepair_id, a.name, a.description, a.adress, a.index,
                a.workers_amount, a.phone, a.email, a.ranking,
                ARRAY_AGG(DISTINCT sw.day_of_week) AS working_days
            FROM autorepairs a
            LEFT JOIN specialization_autorepairs sa ON sa.autorepair_id = a.autorepair_id
            LEFT JOIN specializations s ON sa.specialtion_id = s.specialtion_id
            LEFT JOIN schedule_workings sw ON sw.autorepair_id = a.autorepair_id
            ${workingDaysJoin}
            ${whereSQL}
            GROUP BY a.autorepair_id
            ORDER BY ${orderColumn} ${orderSQL}
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;

        try {
            return await this.dataSource.query(query, params);
        } catch (error) {
            console.error('Database error in getAutorepairs:', error);
            return [];
        }
    }

    async getAutorepairById(id: number) {
        const result = await this.autorepairRepo.findOne({
            where: { autorepairId: id },
            select: { autorepairId: true, name: true, description: true, adress: true, index: true, workersAmount: true, phone: true, email: true, ranking: true },
        });

        if (!result) {
            throw new NotFoundException(`No autorepairs found for id ${id}`);
        }

        return {
            autorepair_id: result.autorepairId,
            name: result.name,
            description: result.description,
            adress: result.adress,
            index: result.index,
            workers_amount: result.workersAmount,
            phone: result.phone,
            email: result.email,
            ranking: result.ranking
        };
    }

    async getAutorepairServicesById(id: number) {
        const autorepair = await this.autorepairRepo.findOne({
            where: { autorepairId: id },
            relations: {
                autorepairServices: {
                    service: true
                }
            }
        });

        if (!autorepair) {
            throw new NotFoundException(`No services in autorepairs found with ID ${id}`);
        }

        return (autorepair.autorepairServices || []).map(tas => ({
            name: tas.service?.name,
            autorepair_service_id: tas.autorepairServiceId
        }));
    }

    async topMostIncomedServicesForAutorepair(count: number, autorepairId: number) {
        console.log(autorepairId);
        const result = await this.dataSource.query(`
            SELECT
                s.name AS service_name,
                COUNT(vs.visit_service_id) AS times_ordered,
                SUM(asr.service_price) AS total_revenue,
                a.autorepair_id,
                a.name AS "Назва автомайстерні",
                a.adress, a.phone, a.email
            FROM visit_services vs
            INNER JOIN autorepair_services asr ON vs.autorepair_service_id = asr.autorepair_service_id
            INNER JOIN services s ON asr.service_id = s.service_id
            INNER JOIN visits v ON vs.visit_id = v.visit_id
            INNER JOIN autorepairs a ON a.autorepair_id = asr.autorepair_id
            WHERE v.is_completed IS TRUE AND asr.autorepair_id = $2
            GROUP BY s.name, a.autorepair_id, a.name, a.adress, a.phone, a.email
            ORDER BY total_revenue DESC
            LIMIT $1
        `, [count, autorepairId]);
        console.log(result);
        return result;
    }

    async getAllAutorepairsStatistics() {
        const result = await this.dataSource.query(`
            SELECT
                a.name AS назва,
                a.description AS опис,
                (SELECT COUNT(DISTINCT sa.specialtion_id) FROM specialization_autorepairs sa WHERE sa.autorepair_id = a.autorepair_id) AS кількість_спеціалізацій,
                (SELECT COUNT(DISTINCT ars.service_id) FROM autorepair_services ars WHERE ars.autorepair_id = a.autorepair_id) AS кількість_послуг,
                a.adress AS адрес,
                a.workers_amount AS кількість_співробітників,
                a.phone AS номер_телефону,
                a.email,
                a.ranking AS рейтинг,
                (SELECT AVG(ars.service_price) FROM autorepair_services ars WHERE ars.autorepair_id = a.autorepair_id) AS середня_ціна_послуг,
                (SELECT COUNT(DISTINCT sw.day_of_week) FROM schedule_workings sw WHERE sw.autorepair_id = a.autorepair_id) AS кількість_робочих_днів,
                (SELECT AVG(EXTRACT(HOUR FROM (sw.end_time_working - sw.start_time_working)) * 60 + EXTRACT(MINUTE FROM (sw.end_time_working - sw.start_time_working))) / 60.0 FROM schedule_workings sw WHERE sw.autorepair_id = a.autorepair_id) AS середня_тривалість_робочого_дня,
                (SELECT COUNT(*) FROM visits v WHERE v.autorepair_id = a.autorepair_id AND v.date_time >= CURRENT_DATE - 7) AS візитів_за_тиждень,
                (SELECT COUNT(*) FROM visits v WHERE v.autorepair_id = a.autorepair_id AND v.date_time >= CURRENT_DATE - 30) AS візитів_за_місяць,
                (SELECT COUNT(*) FROM visits v WHERE v.autorepair_id = a.autorepair_id AND v.date_time >= CURRENT_DATE - 365) AS візитів_за_рік
            FROM autorepairs a
            ORDER BY a.ranking DESC
        `);
        return result;
    }

    async getAutorepairByIdSpecializationServices(id: number) {
        const result = await this.dataSource.query(`
            SELECT A.autorepair_id, A.name, A.description, A.adress, A.index, A.workers_amount,
                   A.phone, A.email, A.ranking,
                   ARRAY_AGG(DISTINCT S.name) Specializations,
                   ARRAY_AGG(DISTINCT SR.name) Services
            FROM autorepairs A
            JOIN specialization_autorepairs SA ON SA.autorepair_id = A.autorepair_id
            JOIN specializations S ON S.specialtion_id = SA.specialtion_id
            JOIN autorepair_services TAS ON TAS.autorepair_id = A.autorepair_id
            JOIN services SR ON SR.service_id = TAS.service_id
            WHERE A.autorepair_id = $1
            GROUP BY A.autorepair_id, A.name, A.description, A.adress, A.index,
                     A.workers_amount, A.phone, A.email, A.ranking
        `, [id]);

        if (result.length === 0) {
            throw new BadRequestException(`No autorepairs found for id ${id}`);
        }

        return result[0];
    }

    async getAutorepairReport(autorepair: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts', 'DejaVuSans.ttf');
            doc.registerFont('custom', fontPath).font('custom');

            const titleColor = '#1e293b';
            const sectionColor = '#0f172a';
            const textColor = '#334155';
            const lineColor = '#cbd5e1';
            const badgeBg = '#2563eb';

            doc.fontSize(26).fillColor(titleColor).text(autorepair.name, { align: 'center' }).moveDown(0.5);
            doc.fontSize(14).fillColor('#475569').text(autorepair.description, { align: 'center' }).moveDown(1.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(lineColor).moveDown(1.2);

            doc.fontSize(18).fillColor(sectionColor).text('Основна інформація', { underline: true }).moveDown(0.7);
            doc.fontSize(13).fillColor(textColor);
            doc.text(`Адреса: ${autorepair.adress}`);
            doc.text(`Поштовий індекс: ${autorepair.index}`);
            doc.text(`Телефон: ${autorepair.phone}`);
            doc.text(`Email: ${autorepair.email}`);
            doc.text(`Кількість працівників: ${autorepair.workers_amount}`);
            doc.text(`Рейтинг: ${autorepair.ranking}`);
            doc.moveDown(1.2);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(lineColor).moveDown(1.2);

            doc.fontSize(18).fillColor(sectionColor).text('Спеціалізації', { underline: true }).moveDown(0.7);
            if (autorepair.specializations && autorepair.specializations.length > 0) {
                autorepair.specializations.forEach((spec: string) => {
                    doc.fontSize(12).fillColor('#ffffff').rect(doc.x, doc.y, doc.widthOfString(spec) + 14, 22).fill(badgeBg)
                        .fillColor('#ffffff').text(`  ${spec}`, doc.x + 2, doc.y + 5).moveDown(1.2);
                });
            } else {
                doc.fontSize(13).fillColor(textColor).text('—');
            }
            doc.moveDown(1.2);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(lineColor).moveDown(1.2);

            doc.fontSize(18).fillColor(sectionColor).text('Послуги', { underline: true }).moveDown(0.7);
            doc.fontSize(13).fillColor(textColor);
            if (autorepair.services && autorepair.services.length > 0) {
                autorepair.services.forEach((service: string, index: number) => {
                    doc.text(`${index + 1}. ${service}`);
                });
            } else {
                doc.text('—');
            }
            doc.moveDown(2);
            doc.fontSize(12).fillColor('#64748b').text(`Дата формування документа: ${new Date().toLocaleString()}`, { align: 'right' });
            doc.end();
        });
    }

    async loginAutorepair(name: string, password: string) {
        const result = await this.autorepairRepo.findOne({
            where: { name, password },
            select: { autorepairId: true },
        });

        if (!result) {
            throw new BadRequestException('Неправильні назва чи пароль автомайстерні');
        }

        return { autorepair_id: result.autorepairId };
    }

    async getAllVisitsByAutorepairId(autorepairId: number) {
        const visits = await this.visitRepo.find({
            where: { autorepairId },
            order: { dateTime: 'ASC' },
        });

        return visits.map(visit => ({
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
        }));
    }

    async getCarSpecializations({
        autorepairId,
        brand,
        model,
        engineType,
    }: {
        autorepairId: number;
        brand?: string;
        model?: string;
        engineType?: string;
    }) {
        let sql = `
            SELECT s.name AS brand, sa.model, sa.engine_type, sa.year
            FROM specialization_autorepairs sa
            JOIN specializations s ON s.specialtion_id = sa.specialtion_id
            WHERE sa.autorepair_id = $1
        `;

        const params: any[] = [autorepairId];
        let i = 2;

        if (brand) { sql += ` AND s.name = $${i++}`; params.push(brand); }
        if (model) { sql += ` AND sa.model = $${i++}`; params.push(model); }
        if (engineType) { sql += ` AND sa.engine_type = $${i++}`; params.push(engineType); }

        const rows = await this.dataSource.query(sql, params);

        return {
            brands: [...new Set(rows.map((r: any) => r.brand))],
            models: [...new Set(rows.map((r: any) => r.model).filter(Boolean))],
            engineTypes: [...new Set(rows.map((r: any) => r.engine_type).filter(Boolean))],
            years: [...new Set(rows.map((r: any) => r.year).filter(Boolean))].sort((a: any, b: any) => b - a),
        };
    }
}