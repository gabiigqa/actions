import { Country, CreateCountryData, UpdateCountryData } from "@/domain/interfaces/domain/entities/Country";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { ICountryRepository } from "@/domain/interfaces/infrastructure/repositories/ICountryRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class CountryRepository extends BaseRepository implements ICountryRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getCountryById(id: number): Promise<Country | null> {
        const query = `
            SELECT code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
            FROM integration.countries 
            WHERE code = $1
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting country by ID: ${id}`, error);
            throw error;
        }
    }

    async getCountryByIsoAlpha2(code: string): Promise<Country | null> {
        const query = `
            SELECT code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
            FROM integration.countries 
            WHERE UPPER(code_iso_alpha_2) = UPPER($1)
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting country by ISO Alpha-2 code: ${code}`, error);
            throw error;
        }
    }

    async getCountryByIsoAlpha3(code: string): Promise<Country | null> {
        const query = `
            SELECT code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
            FROM integration.countries 
            WHERE UPPER(code_iso_alpha_3) = UPPER($1)
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting country by ISO Alpha-3 code: ${code}`, error);
            throw error;
        }
    }

    async getCountryByIsoNumeric(code: number): Promise<Country | null> {
        const query = `
            SELECT code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
            FROM integration.countries 
            WHERE code_iso_numeric = $1
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting country by ISO numeric code: ${code}`, error);
            throw error;
        }
    }

    async getAllCountries(): Promise<Country[]> {
        const query = `
            SELECT code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
            FROM integration.countries 
            ORDER BY name ASC
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all countries', error);
            throw error;
        }
    }

    async createCountry(data: CreateCountryData): Promise<Country> {
        const query = `
            INSERT INTO integration.countries (name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric)
            VALUES ($1, $2, $3, $4)
            RETURNING code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [
                data.name,
                data.code_iso_alpha_2,
                data.code_iso_alpha_3,
                data.code_iso_numeric
            ]);
            return result.rows[0];
        } catch (error) {
            this.loggerService.error('Error creating country', error);
            throw error;
        }
    }

    async updateCountry(id: number, data: UpdateCountryData): Promise<Country | null> {
        const fields = [];
        const values = [];
        let paramCounter = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${paramCounter}`);
            values.push(data.name);
            paramCounter++;
        }

        if (data.code_iso_alpha_2 !== undefined) {
            fields.push(`code_iso_alpha_2 = $${paramCounter}`);
            values.push(data.code_iso_alpha_2);
            paramCounter++;
        }

        if (data.code_iso_alpha_3 !== undefined) {
            fields.push(`code_iso_alpha_3 = $${paramCounter}`);
            values.push(data.code_iso_alpha_3);
            paramCounter++;
        }

        if (data.code_iso_numeric !== undefined) {
            fields.push(`code_iso_numeric = $${paramCounter}`);
            values.push(data.code_iso_numeric);
            paramCounter++;
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `
            UPDATE integration.countries 
            SET ${fields.join(', ')}
            WHERE code = $${paramCounter}
            RETURNING code, name, code_iso_alpha_2, code_iso_alpha_3, code_iso_numeric
        `;
        
        try {
            const result = await this.postgreSQLConnection.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error updating country with ID: ${id}`, error);
            throw error;
        }
    }

    async deleteCountry(id: number): Promise<boolean> {
        const query = `DELETE FROM integration.countries WHERE code = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            this.loggerService.error(`Error deleting country with ID: ${id}`, error);
            throw error;
        }
    }
}