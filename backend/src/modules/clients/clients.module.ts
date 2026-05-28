import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientService } from './clients.service';
import { JwtModule } from '@nestjs/jwt';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { Visit } from '../entities/visit.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Client, Car, Visit]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '20m' },
        }),
    ],
    controllers: [ClientsController],
    providers: [ClientService],
})
export class ClientsModule {}