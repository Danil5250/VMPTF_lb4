import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "../config/database.module";
import {ServicesController} from "./services.controller";
import {ServicesService} from "./services.service";

@Module({
    imports: [ConfigModule, DatabaseModule,],
    controllers: [ServicesController],
    providers: [ServicesService],
})
export class ServicesModule {}