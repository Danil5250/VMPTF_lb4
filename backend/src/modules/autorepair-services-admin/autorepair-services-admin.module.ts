import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorepairServicesAdminController } from './autorepair-services-admin.controller';
import { AutorepairServicesAdminService } from './autorepair-services-admin.service';
import { AutorepairService } from '../entities/autorepair-service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AutorepairService])],
    controllers: [AutorepairServicesAdminController],
    providers: [AutorepairServicesAdminService],
})
export class AutorepairServicesAdminModule {}
