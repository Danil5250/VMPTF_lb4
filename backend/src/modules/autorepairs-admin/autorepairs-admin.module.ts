
import { Module } from '@nestjs/common';
import { AutorepairsAdminService } from './autorepairs-admin.service';
import { AutorepairsAdminController } from './autorepairs-admin.controller';
import { DatabaseModule } from '../config/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DatabaseModule, ConfigModule],
    controllers: [AutorepairsAdminController],
    providers: [AutorepairsAdminService],
})
export class AutorepairsAdminModule { }
