import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import { join } from 'path';
import {ConfigService} from "@nestjs/config";
import cookieParser from "cookie-parser";



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT', 8080)

  const corsOrigin = [
    'http://localhost:5173'
  ]



  app.setGlobalPrefix("api");
  app.use(cookieParser());



  app.enableCors({
    origin: corsOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  await app.listen(PORT ?? 8080);
  console.log("The server has started at http://localhost:8080/")
}
bootstrap();
