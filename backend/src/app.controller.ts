import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Redirect, Render, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {CreateVisitDto} from "./modules/visits/dto/create-visit.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}




}
