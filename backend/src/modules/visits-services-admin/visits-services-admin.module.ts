import { Module } from '@nestjs/common';
import { VisitsServicesAdminService } from './visits-services-admin.service';
import { VisitsServicesAdminController } from './visits-services-admin.controller';

@Module({
    controllers: [VisitsServicesAdminController],
    providers: [VisitsServicesAdminService],
})
export class VisitsServicesAdminModule { }
