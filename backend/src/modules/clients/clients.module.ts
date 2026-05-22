import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "../config/database.module";
import {ClientsController} from "./clients.controller";
import {ClientService} from "./clients.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [ConfigModule, DatabaseModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET || "secret",
        signOptions: {
            expiresIn: "20m",
        }}),],
    controllers: [ClientsController],
    providers: [ClientService],
})
export class ClientsModule {}