import {Module} from "@nestjs/common";
import {DatabaseModule} from "../config/database.module";
import {ConfigModule} from "@nestjs/config";
import {SpecializationController} from "./specialization.controller";
import {SpecializationService} from "./specialization.service";


@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [SpecializationController],
    providers: [SpecializationService],
})
export class SpecializationModule {}