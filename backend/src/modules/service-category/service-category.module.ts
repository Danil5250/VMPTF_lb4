import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';
import { CategoryService } from '../entities/category-service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryService])],
    controllers: [ServiceCategoryController],
    providers: [ServiceCategoryService],
})
export class ServiceCategoriesModule {}