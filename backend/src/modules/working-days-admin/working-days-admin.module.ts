import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingDaysAdminController } from './working-days-admin.controller';
import { WorkingDaysAdminService } from './working-days-admin.service';
import { ScheduleWorking } from '../entities/schedule-working.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleWorking])],
    controllers: [WorkingDaysAdminController],
    providers: [WorkingDaysAdminService],
})
export class WorkingDaysAdminModule {}
