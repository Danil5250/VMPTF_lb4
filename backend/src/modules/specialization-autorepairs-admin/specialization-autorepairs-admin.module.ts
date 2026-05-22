
import { Module } from '@nestjs/common';
import { SpecializationAutorepairsAdminService } from './specialization-autorepairs-admin.service';
import { SpecializationAutorepairsAdminController } from './specialization-autorepairs-admin.controller';
import { DatabaseModule } from '../config/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [SpecializationAutorepairsAdminService],
    controllers: [SpecializationAutorepairsAdminController],
    exports: [SpecializationAutorepairsAdminService]
})
export class SpecializationAutorepairsAdminModule { }
