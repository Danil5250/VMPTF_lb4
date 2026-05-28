import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoRepairController } from './autorepair.controller';
import { AutorepairService } from './autorepair.service';
import { Autorepair } from '../entities/autorepair.entity';
import { Visit } from '../entities/visit.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Autorepair, Visit]),
    ],
    controllers: [AutoRepairController],
    providers: [AutorepairService],
    exports: [AutorepairService],
})
export class AutoRepairModule {}