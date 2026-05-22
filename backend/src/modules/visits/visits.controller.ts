import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param, ParseIntPipe,
    Post,
    Put, Query,
    Redirect,
    Render,
    Req, Res,
    UseGuards
} from "@nestjs/common";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { VisitsService } from "./visits.service";
import { UpdateVisitDto } from "./dto/update-visit.dto";
import type { Request, Response } from "express";
import { OptionalAuthGuard } from "../shared/guards/OptionalAuthGuard";
import {UpdateVisitByAdminDto} from "./dto/update-vsit-by-admin";

@Controller("visits")
export class VisitsController {
    constructor(private readonly appService: VisitsService) { }


    @UseGuards(OptionalAuthGuard)
    @Post("createFullVisit")
    async createFullVisit(@Req() req: Request, @Body() dto: CreateVisitDto) {
        return await this.appService.createVisit(dto, req.user);
    }

    @Post("createVisitByAdmin")
    async createVisitByAdmin(@Body() dto: any) {
        return await this.appService.createVisitByAdmin(dto);
    }


    @UseGuards(OptionalAuthGuard)
    @Put("updateFullVisit/:visitId")
    async updateFullVisit(
        @Req() req: Request,
        @Param("visitId", ParseIntPipe) visitId: number,
        @Body() dto: UpdateVisitDto
    ) {
        return await this.appService.updateVisit(visitId, dto, req.user);
    }



    @Put("updateVisitByAdmin/:visitId")
    async updateVisitByAdmin(
        @Param("visitId", ParseIntPipe) visitId: number,
        @Body() dto: any
    ) {
        return await this.appService.updateVisitByAdmin(visitId, dto)
    }


    @Get("visitAutorepirs/:visitId")
    async getVisitAutorepirs(
        @Param("visitId", ParseIntPipe) visitId: number,
    ) {
        return await this.appService.getVisitAutorepirs(visitId);
    }


    @Post("generateRecordVisit")
    async generateRecordVisit(
        @Body("visitId", ParseIntPipe) visitId: number,
        @Body("clientId", ParseIntPipe) clientId: number,
        @Body("carId", ParseIntPipe) carId: number,
        @Res() res: Response) {
        const pdfBuffer = await this.appService.getVisitReport(visitId, clientId, carId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="visit-${visitId}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
        res.end();
    }


    @Get('getVisitAutorepairServicesById/:visitId')
    async getVisitAutorepairServicesById(
        @Param("visitId", ParseIntPipe) visitId: number,
    ) {
        return await this.appService.getVisitAutorepairServicesById(visitId);
    }


    @Put("updateVisitIsComplete/:visit_id")
    async updateVisitIsComplete(
        @Param("visit_id", ParseIntPipe) visit_id: number,
        @Body("is_completed") is_completed: boolean
    ) {
        return await this.appService.updateVisitByIdSetCompleted(visit_id, is_completed);
    }


    @Put("updateVisitDate/:visit_id")
    async updateVisitDate(
        @Param("visit_id", ParseIntPipe) visit_id: number,
        @Body("date_time") date_time: string
    ) {
        return await this.appService.updateVisitDate(visit_id, new Date(date_time));
    }



    @Get()
    async getIndex(): Promise<{ onlyVisits: any[], clientVisits: any[], clientsVisitsServices: any[] }> {
        return {
            onlyVisits: await this.appService.findAllVisits(),
            clientVisits: await this.appService.findAllVisitsClients(),
            clientsVisitsServices: await this.appService.selectVisitsClientsServices()
        };
    }

    @Delete('/:id')
    async deleteVisit(@Param('id') id: string) {

        console.log("DeleteId", id)

        try {
            await this.appService.deleteVisit(Number(id));
        }
        catch (error) {
            console.error(error);
        }
    }

}