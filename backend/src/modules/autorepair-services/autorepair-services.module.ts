import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorepairServicesController } from './autorepair-services.controller';
import { AutorepairServicesService } from './autorepair-services.service';
import { AutorepairService } from '../entities/autorepair-service.entity';
import { Service } from '../entities/service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AutorepairService, Service])],
    controllers: [AutorepairServicesController],
    providers: [AutorepairServicesService],
    exports: [AutorepairServicesService]
})
export class AutorepairServicesModule { }
