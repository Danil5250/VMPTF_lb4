import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {DATABASE_CONNECTION_TOKEN} from "./database.constants";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            inject: [ConfigService],
            provide: DATABASE_CONNECTION_TOKEN,
            useFactory: async (configService: ConfigService) => {
                const pool = new Pool({
                    host: configService.get<string>('DATABASE_HOST'),
                    port: configService.get<number>('DATABASE_PORT'),
                    user: configService.get<string>('DATABASE_USER'),
                    password: configService.get<string>('DATABASE_PASSWORD'),
                    database: configService.get<string>('DATABASE_DATABASE'),
                    max: configService.get<number>('DATABASE_MAX_USERS'),
                });
                return pool;
            },
        },
    ],
    exports: [DATABASE_CONNECTION_TOKEN],
})
export class DatabaseModule {}
