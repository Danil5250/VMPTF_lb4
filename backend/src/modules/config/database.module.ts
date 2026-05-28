import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { Autorepair } from '../entities/autorepair.entity';
import { Visit } from '../entities/visit.entity';
import { Service } from '../entities/service.entity';
import { CategoryService } from '../entities/category-service.entity';
import { AutorepairService } from '../entities/autorepair-service.entity';
import { VisitService } from '../entities/visit-service.entity';
import { Specialization } from '../entities/specialization.entity';
import { SpecializationAutorepair } from '../entities/specialization-autorepair.entity';
import { ScheduleWorking } from '../entities/schedule-working.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_DATABASE'),
                entities: [
                    Client,
                    Car,
                    Autorepair,
                    Visit,
                    Service,
                    CategoryService,
                    AutorepairService,
                    VisitService,
                    Specialization,
                    SpecializationAutorepair,
                    ScheduleWorking,
                ],
                synchronize: false,
                logging: false,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
