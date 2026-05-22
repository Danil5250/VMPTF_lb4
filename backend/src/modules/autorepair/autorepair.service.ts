import { BadRequestException, Inject, Injectable, NotFoundException, Query } from "@nestjs/common";
import { DATABASE_CONNECTION_TOKEN } from "../config/database.constants";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { RetrieveAutorepairOptions } from "./dto/retrieve-autorepairs-options.dto";
import PDFDocument from "pdfkit";
import * as path from "node:path";

@Injectable()
export class AutorepairService {

    private readonly tableAutorepairs: string;
    private readonly tableAutorepairServices: string;
    private readonly tableServices: string;


    constructor(@Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableAutorepairs = this.configService.get<string>('TABLE_AUTOREPAIRS')!;
        this.tableAutorepairServices = this.configService.get<string>('TABLE_AUTOREPAIR_SERVICES')!;
        this.tableServices = this.configService.get<string>('TABLE_SERVICES')!;
    }


    async getAllAutorepairs() {
        const result = await this.db.query(`SELECT autorepair_id, name FROM ${this.tableAutorepairs} ORDER BY name`);
        return result.rows;
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
            offset = '0'
        } = options;

        const params: any[] = [];
        const where: string[] = [];

        if (name) {
            params.push(`%${name.toLowerCase()}%`);
            where.push(`(
        LOWER(a.name) LIKE $${params.length}
    )`);
        }

        if (city) {
            params.push(`%${city.toLowerCase()}%`);
            where.push(`LOWER(a.adress) LIKE $${params.length}`);
        }
        if (specialization)
            if (specialization?.length > 0) {
                const placeholders = specialization.map((_, i) => `$${params.length + i + 1}`);
                params.push(...specialization);
                where.push(`s.name IN (${placeholders.join(', ')})`);
            }

        let workingDaysJoin = '';
        if (workingDays)
            if (workingDays?.length > 0) {

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

        const validSort = {
            name: 'a.name',
            ranking: 'a.ranking',
            workers_amount: 'a.workers_amount',
            working_days: 'MIN(sw.day_of_week)'
        }[sortBy] || 'a.name';

        const orderSQL = sortOrder === 'DESC' ? 'DESC' : 'ASC';

        params.push(Number(limit));
        const limitIndex = params.length;

        params.push(Number(offset));
        const offsetIndex = params.length;

        const query = `
            SELECT
                a.autorepair_id,
                a.name,
                a.description,
                a.adress,
                a.index,
                a.workers_amount,
                a.phone,
                a.email,
                a.ranking,
                ARRAY_AGG(DISTINCT sw.day_of_week) AS working_days
            FROM Autorepairs a
                     LEFT JOIN Specialization_Autorepairs sa
                               ON sa.autorepair_id = a.autorepair_id
                     LEFT JOIN Specializations s
                               ON sa.specialtion_id = s.specialtion_id
                     LEFT JOIN Schedule_Workings sw
                               ON sw.autorepair_id = a.autorepair_id
                ${workingDaysJoin}
                ${whereSQL}
            GROUP BY a.autorepair_id
            ORDER BY ${validSort} ${orderSQL}
                LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;

        try {
            const result = await this.db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Database error in getAutorepairs:', error);
            return [];
        }
    }


    async getAutorepairById(id: number) {
        const result = await this.db.query(`select autorepair_id, name,
                                                   description, adress, index, workers_amount,
                                                   phone, email, ranking
                                                   from ${this.tableAutorepairs}
        WHERE autorepair_id = $1`, [id])

        if (!result) {
            throw new NotFoundException(`No autorepairs found for ${this.tableAutorepairs}`)
        }

        return result.rows[0]
    }

    async getAutorepairServicesById(id: number) {
        const result = await this.db.query(`select s.name, tas.autorepair_service_id
        from ${this.tableAutorepairs} a
        LEFT JOIN ${this.tableAutorepairServices} tas ON a.autorepair_id = tas.autorepair_id
        LEFT JOIN ${this.tableServices} s ON s.service_id = tas.service_id
        WHERE tAS.autorepair_id = $1`, [id]);

        if (!result) {
            throw new NotFoundException(`No SERVICES IN autorepairs found WITH ID ${id}`)
        }


        return result.rows
    }

    async topMostIncomedServicesForAutorepair(count: number, autorepairId: number) {
        console.log(autorepairId)
        const result = await this.db.query(`
            SELECT
                s.name AS service_name,
                COUNT(vs.visit_service_id) AS times_ordered,
                SUM(asr.service_price) AS total_revenue,
                a.autorepair_id,
                a.name AS "Назва автомайстерні",
                a.adress,
                a.phone,
                a.email
            FROM Visit_Services vs
                     INNER JOIN Autorepair_Services asr ON vs.autorepair_service_id = asr.autorepair_service_id
                     INNER JOIN Services s ON asr.service_id = s.service_id
                     INNER JOIN Visits v ON vs.visit_id = v.visit_id
                     INNER JOIN Autorepairs a ON a.autorepair_id = asr.autorepair_id
            WHERE
                v.is_completed IS TRUE
                AND asr.autorepair_id = $2
            GROUP BY
                s.name,
                a.autorepair_id,
                a.name,
                a.adress,
                a.phone,
                a.email
            ORDER BY total_revenue DESC
                LIMIT $1;`, [count, autorepairId]);
        console.log(result)
        return result.rows
    }

    async getAllAutorepairsStatistics() {
        const result = await this.db.query(`
        SELECT 
    a.name AS назва,
    a.description AS опис,
    (
        SELECT COUNT(DISTINCT sa.specialtion_id)
        FROM Specialization_Autorepairs sa
        WHERE sa.autorepair_id = a.autorepair_id
    ) AS кількість_спеціалізацій,
    (
        SELECT COUNT(DISTINCT ars.service_id)
        FROM Autorepair_Services ars
        WHERE ars.autorepair_id = a.autorepair_id
    ) AS кількість_послуг,
    a.adress AS адрес,
    a.workers_amount AS кількість_співробітників,
    a.phone AS номер_телефону,
    a.email,
    a.ranking AS рейтинг,
    (
        SELECT AVG(ars.service_price)
        FROM Autorepair_Services ars
        WHERE ars.autorepair_id = a.autorepair_id
    ) AS середня_ціна_послуг,
    (
        SELECT COUNT(DISTINCT sw.day_of_week)
        FROM Schedule_Workings sw
        WHERE sw.autorepair_id = a.autorepair_id
    ) AS кількість_робочих_днів,
    (
        SELECT AVG(
            EXTRACT(HOUR FROM (sw.end_time_working - sw.start_time_working)) * 60 +
            EXTRACT(MINUTE FROM (sw.end_time_working - sw.start_time_working))
        ) / 60.0
        FROM Schedule_Workings sw
        WHERE sw.autorepair_id = a.autorepair_id
    ) AS середня_тривалість_робочого_дня,
    (
        SELECT COUNT(*)
        FROM Visits v
        WHERE v.autorepair_id = a.autorepair_id
        AND v.date_time <= CURRENT_DATE - 7
    ) AS візитів_за_тиждень,
    (
        SELECT COUNT(*)
        FROM Visits v
        WHERE v.autorepair_id = a.autorepair_id
        AND v.date_time <= CURRENT_DATE - 30
    ) AS візитів_за_місяць,
    (
        SELECT COUNT(*)
        FROM Visits v
        WHERE v.autorepair_id = a.autorepair_id
        AND v.date_time <= CURRENT_DATE - 365
    ) AS візитів_за_рік
FROM Autorepairs a
ORDER BY a.ranking DESC;
        `);
        return result.rows;
    }


    async getAutorepairByIdSpecializationServices(id: number) {
        const result = await this.db.query(`select A.autorepair_id, A.name,
                                                   A.description, A.adress, A.index, A.workers_amount,
                                                   A.phone, A.email, A.ranking, ARRAY_AGG(DISTINCT S.NAME) Specializations,
                                                   ARRAY_AGG(DISTINCT SR.name) Services
                                                   from ${this.tableAutorepairs} A
                                                   JOIN Specialization_Autorepairs SA ON SA.autorepair_id = A.autorepair_id
                                                   JOIN Specializations S ON S.specialtion_id = SA.specialtion_id
                                                   JOIN Autorepair_Services TAS ON TAS.autorepair_id = A.autorepair_id
                                                   JOIN Services SR ON SR.service_id = TAS.service_id
                                                   
                                            WHERE A.autorepair_id = $1
                                            GROUP BY
                                                a.autorepair_id,
                                                a.name,
                                                a.description,
                                                a.adress,
                                                A.index,
                                                a.workers_amount,
                                                a.phone,
                                                a.email,
                                                A.ranking;`, [id]);

        if (result.rows.length === 0) {
            throw new BadRequestException(`No autorepairs found for ${this.tableAutorepairs}`)
        }

        return result.rows[0]
    }

    async getAutorepairReport(autorepair: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                margin: 50,
                size: "A4"
            });

            const chunks: Buffer[] = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            // Шрифт
            const fontPath = path.join(__dirname, "..", "..", "assets", "fonts", "DejaVuSans.ttf");
            doc.registerFont("custom", fontPath).font("custom");

            // Основні кольори
            const titleColor = "#1e293b";
            const sectionColor = "#0f172a";
            const textColor = "#334155";
            const lineColor = "#cbd5e1";
            const badgeBg = "#2563eb";
            const badgeText = "#ffffff";

            // Заголовок
            doc
                .fontSize(26)
                .fillColor(titleColor)
                .text(autorepair.name, { align: "center" })
                .moveDown(0.5);

            doc
                .fontSize(14)
                .fillColor("#475569")
                .text(autorepair.description, { align: "center" })
                .moveDown(1.5);

            // Лінія
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke(lineColor)
                .moveDown(1.2);

            // Секція "Основна інформація"
            doc
                .fontSize(18)
                .fillColor(sectionColor)
                .text("Основна інформація", { underline: true })
                .moveDown(0.7);

            doc.fontSize(13).fillColor(textColor);
            doc.text(`Адреса: ${autorepair.adress}`);
            doc.text(`Поштовий індекс: ${autorepair.index}`);
            doc.text(`Телефон: ${autorepair.phone}`);
            doc.text(`Email: ${autorepair.email}`);
            doc.text(`Кількість працівників: ${autorepair.workers_amount}`);
            doc.text(`Рейтинг: ${autorepair.ranking}`);
            doc.moveDown(1.2);

            // Лінія
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke(lineColor)
                .moveDown(1.2);

            // Секція "Спеціалізації"
            doc
                .fontSize(18)
                .fillColor(sectionColor)
                .text("Спеціалізації", { underline: true })
                .moveDown(0.7);

            if (autorepair.specializations && autorepair.specializations.length > 0) {
                autorepair.specializations.forEach((spec: string) => {
                    doc
                        .fontSize(12)
                        .fillColor(badgeText)
                        .rect(doc.x, doc.y, doc.widthOfString(spec) + 14, 22)
                        .fill(badgeBg)
                        .fillColor("#ffffff")
                        .text(`  ${spec}`, doc.x + 2, doc.y + 5)
                        .moveDown(1.2);
                });
            } else {
                doc.fontSize(13).fillColor(textColor).text("—");
            }

            doc.moveDown(1.2);

            // Лінія
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke(lineColor)
                .moveDown(1.2);

            // Секція "Послуги"
            doc
                .fontSize(18)
                .fillColor(sectionColor)
                .text("Послуги", { underline: true })
                .moveDown(0.7);

            doc.fontSize(13).fillColor(textColor);

            if (autorepair.services && autorepair.services.length > 0) {
                autorepair.services.forEach((service: string, index: number) => {
                    doc.text(`${index + 1}. ${service}`);
                });
            } else {
                doc.text("—");
            }

            doc.moveDown(2);

            // Footer
            doc
                .fontSize(12)
                .fillColor("#64748b")
                .text(`Дата формування документа: ${new Date().toLocaleString()}`, {
                    align: "right"
                });

            doc.end();
        });
    }


    async loginAutorepair(name: string, password: string) {
        const result = await this.db.query(`
        SELECT AUTOREPAIR_ID FROM AUTOREPAIRS
        WHERE NAME = $1 AND PASSWORD = $2`, [name, password]);

        if (result.rows.length < 0) {
            throw new BadRequestException('Неправильні назва чи пароль автомайстерні')
        }

        return result.rows[0];
    }


    async getAllVisitsByAutorepairId(autorepairId: number) {
        const result = await this.db.query(`
        SELECT * FROM VISITS WHERE autorepair_id = $1 ORDER BY date_time`, [autorepairId]);

        return result.rows;
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
        SELECT
            s.name AS brand,
            sa.model,
            sa.engine_type,
            sa.year
        FROM Specialization_Autorepairs sa
        JOIN Specializations s
          ON s.specialtion_id = sa.specialtion_id
        WHERE sa.autorepair_id = $1
        `;

        const params: any[] = [
            autorepairId,]
        let i = 2;


        if (brand) {
            sql += ` AND s.name = $${i++}`;
            params.push(brand);
        }
        if (model) {
            sql += ` AND sa.model = $${i++}`;
            params.push(model);
        }
        if (engineType) {
            sql += ` AND sa.engine_type = $${i++}`;
            params.push(engineType);
        }

        const { rows } = await this.db.query(sql,
            params
        );

        return {
            brands: [...new Set(rows.map(r => r.brand))],
            models: [...new Set(rows.map(r => r.model).filter(Boolean))],
            engineTypes: [...new Set(rows.map(r => r.engine_type).filter(Boolean))],
            years: [...new Set(rows.map(r => r.year).filter(Boolean))].sort((a, b) => b - a),
        };

    }

}