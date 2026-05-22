import { Module } from '@nestjs/common';
import { AutorepairServicesController } from './autorepair-services.controller';
import { AutorepairServicesService } from './autorepair-services.service';

@Module({
    controllers: [AutorepairServicesController],
    providers: [AutorepairServicesService],
    exports: [AutorepairServicesService]
})
export class AutorepairServicesModule { }
