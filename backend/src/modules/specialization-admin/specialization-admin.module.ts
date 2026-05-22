
import { Module } from '@nestjs/common';
import { SpecializationAdminService } from './specialization-admin.service';
import { SpecializationAdminController } from './specialization-admin.controller';
import { DatabaseModule } from '../config/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [SpecializationAdminController],
    providers: [SpecializationAdminService],
})
export class SpecializationAdminModule { }
