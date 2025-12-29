import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { EmailTemplate, IEmailTemplateRepository } from "@/domain/interfaces/infrastructure/repositories/IEmailTemplateRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class EmailTemplateRepository extends BaseRepository implements IEmailTemplateRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getAllTemplates(): Promise<EmailTemplate[]> {
        try {
            this.loggerService.info('Getting all email templates');

            const query = `
                SELECT 
                    id, 
                    template_name, 
                    subject, 
                    recipients, 
                    cc, 
                    bcc, 
                    body, 
                    template_type, 
                    created_at, 
                    updated_at
                FROM integration.email_templates
                ORDER BY template_name
            `;

            const result = await this.postgreSQLConnection.query(query, []);

            const templates: EmailTemplate[] = result.rows.map((row: any) => ({
                id: row.id,
                templateName: row.template_name,
                subject: row.subject,
                recipients: row.recipients || [],
                cc: row.cc || [],
                bcc: row.bcc || [],
                body: row.body,
                templateType: row.template_type,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            }));

            this.loggerService.info(`Found ${templates.length} email templates`);
            return templates;
        } catch (error) {
            this.loggerService.error('Error getting all email templates:', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get email templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getTemplateById(id: number): Promise<EmailTemplate | null> {
        try {
            this.loggerService.info(`Getting email template by ID: ${id}`);

            const query = `
                SELECT 
                    id, 
                    template_name, 
                    subject, 
                    recipients, 
                    cc, 
                    bcc, 
                    body, 
                    template_type, 
                    created_at, 
                    updated_at
                FROM integration.email_templates
                WHERE id = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [id]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Email template not found for ID: ${id}`);
                return null;
            }

            const row = result.rows[0];

            const template: EmailTemplate = {
                id: row.id,
                templateName: row.template_name,
                subject: row.subject,
                recipients: row.recipients || [],
                cc: row.cc || [],
                bcc: row.bcc || [],
                body: row.body,
                templateType: row.template_type,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            };

            this.loggerService.info(`Email template found: ${template.templateName} (ID: ${template.id})`);
            return template;
        } catch (error) {
            this.loggerService.error('Error getting email template by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get email template by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getTemplateByName(templateName: string): Promise<EmailTemplate | null> {
        try {
            this.loggerService.info(`Getting email template by name: ${templateName}`);

            const query = `
                SELECT 
                    id, 
                    template_name, 
                    subject, 
                    recipients, 
                    cc, 
                    bcc, 
                    body, 
                    template_type, 
                    created_at, 
                    updated_at
                FROM integration.email_templates
                WHERE template_name = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [templateName]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Email template not found for name: ${templateName}`);
                return null;
            }

            const row = result.rows[0];

            const template: EmailTemplate = {
                id: row.id,
                templateName: row.template_name,
                subject: row.subject,
                recipients: row.recipients || [],
                cc: row.cc || [],
                bcc: row.bcc || [],
                body: row.body,
                templateType: row.template_type,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            };

            this.loggerService.info(`Email template found: ${template.templateName} (ID: ${template.id})`);
            return template;
        } catch (error) {
            this.loggerService.error('Error getting email template by name:', {
                templateName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get email template by name: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getTemplatesByType(templateType: string): Promise<EmailTemplate[]> {
        try {
            this.loggerService.info(`Getting email templates by type: ${templateType}`);

            const query = `
                SELECT 
                    id, 
                    template_name, 
                    subject, 
                    recipients, 
                    cc, 
                    bcc, 
                    body, 
                    template_type, 
                    created_at, 
                    updated_at
                FROM integration.email_templates
                WHERE template_type = $1
                ORDER BY template_name
            `;

            const result = await this.postgreSQLConnection.query(query, [templateType]);

            const templates: EmailTemplate[] = result.rows.map((row: any) => ({
                id: row.id,
                templateName: row.template_name,
                subject: row.subject,
                recipients: row.recipients || [],
                cc: row.cc || [],
                bcc: row.bcc || [],
                body: row.body,
                templateType: row.template_type,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            }));

            this.loggerService.info(`Found ${templates.length} email templates for type: ${templateType}`);
            return templates;
        } catch (error) {
            this.loggerService.error('Error getting email templates by type:', {
                templateType,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get email templates by type: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}