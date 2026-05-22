import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "../config/database.module";
import {AutoRepairController} from "./autorepair.controller";
import {AutorepairService} from "./autorepair.service";

@Module({
    imports: [ConfigModule, DatabaseModule,],
    controllers: [AutoRepairController],
    providers: [AutorepairService],
    exports: [AutorepairService],
})
export class AutoRepairModule {}