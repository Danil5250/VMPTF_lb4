import { Module } from '@nestjs/common';
import { AutorepairServicesAdminService } from './autorepair-services-admin.service';
import { AutorepairServicesAdminController } from './autorepair-services-admin.controller';
import { DatabaseModule } from '../config/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AutorepairServicesAdminController],
    providers: [AutorepairServicesAdminService],
    exports: [AutorepairServicesAdminService]
})
export class AutorepairServicesAdminModule { }
