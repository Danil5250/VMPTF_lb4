import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategoryAdminController } from './service-category-admin.controller';
import { ServiceCategoryAdminService } from './service-category-admin.service';
import { CategoryService } from '../entities/category-service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryService])],
    controllers: [ServiceCategoryAdminController],
    providers: [ServiceCategoryAdminService],
})
export class ServiceCategoryAdminModule {}
