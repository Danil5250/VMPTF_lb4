import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {DATABASE_CONNECTION_TOKEN} from "../config/database.constants";
import {Pool, QueryResult} from "pg";
import {ConfigService} from "@nestjs/config";
import {Specialization} from "../specialization/specialization.service";

@Injectable()
export class ServiceCategoryService {

    private readonly tableServiceCategories: string;

    constructor(
        @Inject(DATABASE_CONNECTION_TOKEN) private db: Pool,
        private configService: ConfigService
    ) {
        this.tableServiceCategories = this.configService.get<string>('TABLE_CATEGORY_SERVICES')!;
    }

    async getAllCategories() {
        try{
            const result:QueryResult<Specialization> = await this.db.query(
                `SELECT * FROM ${this.tableServiceCategories}`
            );
            return result.rows;
        }
        catch (error){
            throw new BadRequestException(error);
        }
    }

}