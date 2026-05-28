import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { MailModule } from '../email/mail.module';
import { Visit } from '../entities/visit.entity';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { VisitService } from '../entities/visit-service.entity';
import { AutorepairService } from '../entities/autorepair-service.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Visit, Client, Car, VisitService, AutorepairService]),
        MailModule,
    ],
    controllers: [VisitsController],
    providers: [VisitsService],
})
export class VisitsModule {}