import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorepairsAdminController } from './autorepairs-admin.controller';
import { AutorepairsAdminService } from './autorepairs-admin.service';
import { Autorepair } from '../entities/autorepair.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Autorepair])],
    controllers: [AutorepairsAdminController],
    providers: [AutorepairsAdminService],
})
export class AutorepairsAdminModule {}
