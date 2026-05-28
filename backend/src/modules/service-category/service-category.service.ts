import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService as CategoryServiceEntity } from '../entities/category-service.entity';

@Injectable()
export class ServiceCategoryService {
    constructor(
        @InjectRepository(CategoryServiceEntity)
        private readonly categoryServiceRepo: Repository<CategoryServiceEntity>,
    ) {}

    async getAllCategories() {
        try {
            const categories = await this.categoryServiceRepo.find();
            return categories.map(c => ({
                category_service_id: c.categoryServiceId,
                category_name: c.categoryName
            }));
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}