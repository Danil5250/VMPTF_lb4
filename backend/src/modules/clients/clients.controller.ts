import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put, Query, Req, Res, UseGuards
} from "@nestjs/common";
import { AppService } from "../../app.service";
import { ClientService } from "./clients.service";
import { CreateClientDto } from "./dto/add-client.dto";
import { CreateServiceDto } from "../services/add-service.dto";
import { ClientLoginDto } from "./dto/login-client.dto";
import { AuthGuard } from "../shared/guards/AuthGuard";
import type { Response } from 'express';
import type { Request } from 'express';
import { CreateCarDto } from "./dto/add-car.dto";

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientService) { }


    @Post('register')
    async register(@Body() createClientDto: CreateClientDto) {
        console.log(createClientDto);
        return await this.clientsService.register(createClientDto);
    }

    @Post('login')
    async login(@Body() loginClientDto: ClientLoginDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.clientsService.validateUserByLogin(loginClientDto.login, loginClientDto.password);

        const token = await this.clientsService.createAccessToken(user.client_id, loginClientDto.login);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 20 * 60 * 1000,
        })
        return { message: "ok" };
    }

    @Get('getCarsByClientId/:client_id')
    async getCarsByClientId(
        @Param('client_id', ParseIntPipe) client_id: number,
    ) {
        return await this.clientsService.getCarsByClientId(client_id);
    }

    @Get("user")
    @UseGuards(AuthGuard)
    me(@Req() req: Request) {
        console.log("Controller", req.user)
        return req.user ?? null;
    }

    @Get('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        });

        return { message: 'Logged out' };
    }


    @Get('clientsVisits/:client_id')
    async getAllVisitsByClientId(
        @Param('client_id', ParseIntPipe) client_id: number,
    ) {
        return await this.clientsService.getVisitsByClientId(client_id);
    }


    @Get('topActiveClients/:count')
    async topActiveClients(
        @Param('count', ParseIntPipe) count: number,
    ) {
        return await this.clientsService.topActiveClients(count)
    }

    @Post('addCarToClient/:client_id')
    async addCarToClient(
        @Param('client_id', ParseIntPipe) client_id: number,
        @Body() createCarDto: CreateCarDto
    ) {
        return await this.clientsService.addCarToClient(createCarDto, client_id);
    }


    @Delete('/:id')
    async deleteClient(@Param('id', ParseIntPipe) id: number) {
        return await this.clientsService.deleteClient(id);
    }






    @Get('getClientById/:id')
    async getClientById(@Param('id', ParseIntPipe) id: number) {
        const client = await this.clientsService.getClientById(id);
        return { client };
    }









    @Post()
    @HttpCode(201)
    async addNewClient(@Body() body: CreateClientDto) {
        const newClient = await this.clientsService.createClient(body);
        return { message: 'Client successfully created', client: newClient };
    }





    @Put('/:id')
    async updateClient(@Param('id') id: string, @Body() body: CreateClientDto) {
        await this.clientsService.update(Number(id), body);

    }


    @Get('info/:id')
    async findClientInfoById(@Param('id') id: number) {
        return { clientInfo: await this.clientsService.findOneClientInfoById(id) };
    }

    @Get('all')
    async getAllClients() {
        return await this.clientsService.findAllClients();
    }
}