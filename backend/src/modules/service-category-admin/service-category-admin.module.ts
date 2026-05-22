import { Module } from '@nestjs/common';
import { ServiceCategoryAdminService } from './service-category-admin.service';
import { ServiceCategoryAdminController } from './service-category-admin.controller';
import { DatabaseModule } from '../config/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [ServiceCategoryAdminController],
    providers: [ServiceCategoryAdminService],
})
export class ServiceCategoryAdminModule { }
