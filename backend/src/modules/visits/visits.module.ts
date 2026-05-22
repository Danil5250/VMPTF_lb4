import {VisitsController} from "./visits.controller";
import {Module} from "@nestjs/common";
import {VisitsService} from "./visits.service";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "../config/database.module";
import {MailModule} from "../email/mail.module";

@Module({
    imports: [ConfigModule, DatabaseModule, MailModule],
    controllers: [VisitsController],
    providers: [VisitsService],
})
export class VisitsModule {
}