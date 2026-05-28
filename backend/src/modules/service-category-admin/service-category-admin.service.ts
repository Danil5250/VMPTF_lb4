import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../entities/category-service.entity';
import { CreateCategoryServiceDto } from './dto/create-category-service.dto';
import { UpdateCategoryServiceDto } from './dto/update-category-service.dto';

@Injectable()
export class ServiceCategoryAdminService {
    constructor(
        @InjectRepository(CategoryService)
        private readonly categoryServiceRepo: Repository<CategoryService>,
    ) {}

    private mapCategory(c: CategoryService) {
        if (!c) return null;
        return {
            category_service_id: c.categoryServiceId,
            category_name: c.categoryName
        };
    }

    async create(createCategoryServiceDto: CreateCategoryServiceDto) {
        const category = this.categoryServiceRepo.create({
            categoryName: createCategoryServiceDto.category_name,
        });

        const saved = await this.categoryServiceRepo.save(category);
        return this.mapCategory(saved);
    }

    async findAll() {
        const categories = await this.categoryServiceRepo.find({
            order: { categoryServiceId: 'ASC' },
        });
        return categories.map(c => this.mapCategory(c));
    }

    async findOne(id: number) {
        const category = await this.categoryServiceRepo.findOneBy({ categoryServiceId: id });

        if (!category) {
            throw new NotFoundException(`CategoryService with ID ${id} not found`);
        }

        return this.mapCategory(category);
    }

    async update(id: number, updateCategoryServiceDto: UpdateCategoryServiceDto) {
        if (!updateCategoryServiceDto.category_name) {
            return this.findOne(id);
        }

        await this.categoryServiceRepo.update(
            { categoryServiceId: id },
            { categoryName: updateCategoryServiceDto.category_name }
        );

        const updated = await this.categoryServiceRepo.findOneBy({ categoryServiceId: id });
        if (!updated) {
            throw new NotFoundException(`CategoryService with ID ${id} not found`);
        }

        return this.mapCategory(updated);
    }

    async remove(id: number) {
        const category = await this.findOne(id);
        await this.categoryServiceRepo.delete({ categoryServiceId: id });
        return category; // already mapped
    }
}
