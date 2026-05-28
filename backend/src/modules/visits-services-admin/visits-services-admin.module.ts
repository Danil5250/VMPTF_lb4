import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsServicesAdminController } from './visits-services-admin.controller';
import { VisitsServicesAdminService } from './visits-services-admin.service';
import { VisitService } from '../entities/visit-service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VisitService])],
    controllers: [VisitsServicesAdminController],
    providers: [VisitsServicesAdminService],
})
export class VisitsServicesAdminModule {}
