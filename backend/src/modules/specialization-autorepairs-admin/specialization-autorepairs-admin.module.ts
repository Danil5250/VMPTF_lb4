import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationAutorepairsAdminController } from './specialization-autorepairs-admin.controller';
import { SpecializationAutorepairsAdminService } from './specialization-autorepairs-admin.service';
import { SpecializationAutorepair } from '../entities/specialization-autorepair.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SpecializationAutorepair])],
    controllers: [SpecializationAutorepairsAdminController],
    providers: [SpecializationAutorepairsAdminService],
})
export class SpecializationAutorepairsAdminModule {}
