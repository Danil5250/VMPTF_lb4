import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { Specialization } from '../entities/specialization.entity';
import { SpecializationAutorepair } from '../entities/specialization-autorepair.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Specialization, SpecializationAutorepair])],
    controllers: [SpecializationController],
    providers: [SpecializationService],
})
export class SpecializationModule {}