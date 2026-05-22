import {Controller, Get} from "@nestjs/common";
import {ServiceCategoryService} from "./service-category.service";


@Controller('serviceCategory')
export class ServiceCategoryController {
    constructor(private serviceCategoryService: ServiceCategoryService) {}

    @Get()
    async getAllSpecializations(){
        return await this.serviceCategoryService.getAllCategories();
    }

}