import { Module } from '@nestjs/common';
import { WorkingDaysAdminService } from './working-days-admin.service';
import { WorkingDaysAdminController } from './working-days-admin.controller';

@Module({
    controllers: [WorkingDaysAdminController],
    providers: [WorkingDaysAdminService],
})
export class WorkingDaysAdminModule { }
