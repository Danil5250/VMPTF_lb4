import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "../config/database.module";
import {ServiceCategoryController} from "./service-category.controller";
import {ServiceCategoryService} from "./service-category.service";


@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [ServiceCategoryController],
    providers: [ServiceCategoryService],
})
export class ServiceCategoriesModule {}