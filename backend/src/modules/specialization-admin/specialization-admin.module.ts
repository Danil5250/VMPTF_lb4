import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationAdminController } from './specialization-admin.controller';
import { SpecializationAdminService } from './specialization-admin.service';
import { Specialization } from '../entities/specialization.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Specialization])],
    controllers: [SpecializationAdminController],
    providers: [SpecializationAdminService],
})
export class SpecializationAdminModule {}
