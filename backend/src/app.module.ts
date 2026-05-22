import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from "./modules/config/database.module";
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from "./modules/clients/clients.module";
import { ServicesModule } from "./modules/services/services.module";
import { VisitsModule } from "./modules/visits/visits.module";
import { AutoRepairModule } from "./modules/autorepair/autorepair.module";
import { SpecializationModule } from "./modules/specialization/specialization.module";
import { ServiceCategoriesModule } from "./modules/service-category/service-category.module";
import { MailModule } from "./modules/email/mail.module";
import { AutorepairServicesModule } from "./modules/autorepair-services/autorepair-services.module";
import { CarsModule } from "./modules/cars/cars.module";
import { AutorepairsAdminModule } from "./modules/autorepairs-admin/autorepairs-admin.module";
import { ServiceCategoryAdminModule } from "./modules/service-category-admin/service-category-admin.module";
import { SpecializationAdminModule } from "./modules/specialization-admin/specialization-admin.module";
import { WorkingDaysAdminModule } from "./modules/working-days-admin/working-days-admin.module";
import { VisitsServicesAdminModule } from "./modules/visits-services-admin/visits-services-admin.module";
import { AutorepairServicesAdminModule } from "./modules/autorepair-services-admin/autorepair-services-admin.module";
import { SpecializationAutorepairsAdminModule } from "./modules/specialization-autorepairs-admin/specialization-autorepairs-admin.module";


@Module({
  imports: [DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule,
    ServicesModule,
    VisitsModule,
    AutoRepairModule,
    SpecializationModule,
    ServiceCategoriesModule,
    MailModule,
    AutorepairServicesModule,
    CarsModule,
    AutorepairsAdminModule,
    ServiceCategoryAdminModule,
    SpecializationAdminModule,
    WorkingDaysAdminModule,
    VisitsServicesAdminModule,
    AutorepairServicesAdminModule,
    SpecializationAutorepairsAdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
