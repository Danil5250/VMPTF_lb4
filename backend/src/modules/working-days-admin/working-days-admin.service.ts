import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ScheduleWorking } from '../entities/schedule-working.entity';
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';

@Injectable()
export class WorkingDaysAdminService {
    constructor(
        @InjectRepository(ScheduleWorking)
        private readonly scheduleRepo: Repository<ScheduleWorking>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createWorkingDayDto: CreateWorkingDayDto) {
        const schedule = this.scheduleRepo.create({
            dayOfWeek: createWorkingDayDto.day_of_week,
            startTimeWorking: createWorkingDayDto.start_time_working,
            endTimeWorking: createWorkingDayDto.end_time_working,
            comment: createWorkingDayDto.comment,
            autorepairId: createWorkingDayDto.autorepair_id,
        });

        return await this.scheduleRepo.save(schedule);
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT sw.*, a.name as autorepair_name
            FROM schedule_workings sw
            JOIN autorepairs a ON sw.autorepair_id = a.autorepair_id
            ORDER BY sw.schedule_id DESC
        `);
    }

    async findOne(id: number) {
        const schedule = await this.scheduleRepo.findOneBy({ scheduleId: id });

        if (!schedule) {
            throw new NotFoundException(`ScheduleWorking with ID ${id} not found`);
        }

        return schedule;
    }

    async update(id: number, updateWorkingDayDto: UpdateWorkingDayDto) {
        const fields = Object.keys(updateWorkingDayDto);
        if (fields.length === 0) {
            return this.findOne(id);
        }

        const updateObj: any = {};
        if (updateWorkingDayDto.day_of_week !== undefined) updateObj.dayOfWeek = updateWorkingDayDto.day_of_week;
        if (updateWorkingDayDto.start_time_working !== undefined) updateObj.startTimeWorking = updateWorkingDayDto.start_time_working;
        if (updateWorkingDayDto.end_time_working !== undefined) updateObj.endTimeWorking = updateWorkingDayDto.end_time_working;
        if (updateWorkingDayDto.comment !== undefined) updateObj.comment = updateWorkingDayDto.comment;
        if (updateWorkingDayDto.autorepair_id !== undefined) updateObj.autorepairId = updateWorkingDayDto.autorepair_id;

        await this.scheduleRepo.update({ scheduleId: id }, updateObj);

        const updated = await this.scheduleRepo.findOneBy({ scheduleId: id });
        if (!updated) {
            throw new NotFoundException(`ScheduleWorking with ID ${id} not found`);
        }

        return updated;
    }

    async remove(id: number) {
        const schedule = await this.findOne(id);
        await this.scheduleRepo.delete({ scheduleId: id });
        return schedule;
    }
}
