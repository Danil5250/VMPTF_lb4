import { Body, Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Res } from "@nestjs/common";
import { AutorepairService } from "./autorepair.service";
import { RetrieveAutorepairOptions } from "./dto/retrieve-autorepairs-options.dto";
import type { Response } from 'express'

@Controller("autorepair")
export class AutoRepairController {

    constructor(private readonly autorepairService: AutorepairService) {
    }

    @Get('all')
    async getAllAutorepairs() {
        return await this.autorepairService.getAllAutorepairs();
    }

    @Get()
    async getAutoRepair(
        @Query("name") name?: string,
        @Query("city") city?: string,
        @Query('specialization', new ParseArrayPipe({ optional: true, items: String })) specialization?: string[],
        @Query('workingDays', new ParseArrayPipe({ optional: true, items: String })) workingDays?: string[],
        @Query("sortBy") sortBy?: 'name' | 'ranking' | 'workers_amount',
        @Query("sortOrder") sortOrder: 'ASC' | 'DESC' = 'DESC',
        @Query("limit") limit?: string,
        @Query('offset') offset?: string,
    ) {
        const options: Partial<RetrieveAutorepairOptions> = {
            name,
            city,
            specialization,
            workingDays,
            sortBy,
            sortOrder,
            limit,
            offset
        };
        console.log(specialization,
            workingDays,)
        return await this.autorepairService.getAutorepairs(options);
    }


    @Get('mostIncomedServicesForAutorepair/:autorepairId/:count')
    async topMostIncomedServicesForAutorepair(
        @Param('autorepairId', ParseIntPipe) autorepairId: number,
        @Param('count', ParseIntPipe) count: number
    ) {
        console.log(autorepairId);
        return await this.autorepairService
            .topMostIncomedServicesForAutorepair(count, autorepairId);
    }

    @Get('allAutorepairsStatistics')
    async getAllAutorepairsStatistics() {
        return await this.autorepairService.getAllAutorepairsStatistics();
    }

    @Get("autorepairSpecializations/:autorepair_id")
    async getAutorepairSpecializations(
        @Param('autorepair_id') autorepairId: number,
        @Query('brand') brand?: string,
        @Query('model') model?: string,
        @Query('engineType') engineType?: string,
    ) {
        return this.autorepairService.getCarSpecializations({
            autorepairId,
            brand,
            model,
            engineType,
        });
    }


    @Get('getAutorepairsReportById/:autorepair_id')
    async getAutorepairsReport(
        @Param('autorepair_id') autorepairId: number,
        @Res() res: Response
    ) {
        console.log(autorepairId);
        const autorepair = await this.autorepairService.getAutorepairByIdSpecializationServices(autorepairId)
        console.log(autorepair);

        const pdfBuffer = await this.autorepairService.getAutorepairReport(autorepair);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="autorepair.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
        res.end();
    }

    @Post("login")
    async loginAutorepair(
        @Body('name') name: string,
        @Body('password') password: string
    ) {
        return await this.autorepairService.loginAutorepair(name, password);
    }




    @Get("visitbyAutorepair/:autorepair_id")
    async getAllVisitsByAutorepair(@Param('autorepair_id') autorepairId: number) {
        return this.autorepairService.getAllVisitsByAutorepairId(autorepairId);
    }







    @Get("byId/:id")
    async getAutorepairById(@Param('id', ParseIntPipe) id: number) {
        return await this.autorepairService.getAutorepairById(id);
    }

    @Get("services/:id")
    async getAutorepairService(@Param('id', ParseIntPipe) id: number) {
        return await this.autorepairService.getAutorepairServicesById(id);
    }
}