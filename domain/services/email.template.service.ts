import { IEmailTemplateService, ProcessedEmailTemplate } from '@/domain/interfaces/domain/services/IEmailTemplateService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { EmailTemplate, IEmailTemplateRepository } from '@/domain/interfaces/infrastructure/repositories/IEmailTemplateRepository';
import { TYPES } from '@/infrastructure/config/inversify';
import { inject, injectable } from 'inversify';

/**
 * Email Template Service
 * Provides business logic for managing and processing email templates
 */
@injectable()
export class EmailTemplateService implements IEmailTemplateService {
    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.IEmailTemplateRepository) private emailTemplateRepository: IEmailTemplateRepository
    ) {}

    async getAllTemplates(): Promise<EmailTemplate[]> {
        this.logger.info('Fetching all email templates');
        try {
            const templates = await this.emailTemplateRepository.getAllTemplates();
            this.logger.info(`Retrieved ${templates.length} email templates`);
            return templates;
        } catch (error) {
            this.logger.error('Error fetching all email templates:', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async getTemplateById(id: number): Promise<EmailTemplate | null> {
        this.logger.info(`Fetching email template with ID: ${id}`);
        try {
            const template = await this.emailTemplateRepository.getTemplateById(id);
            if (!template) {
                this.logger.warn(`Email template with ID ${id} not found`);
            } else {
                this.logger.info(`Email template found: ${template.templateName} (ID: ${id})`);
            }
            return template;
        } catch (error) {
            this.logger.error('Error fetching email template by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async getTemplateByName(templateName: string): Promise<EmailTemplate | null> {
        this.logger.info(`Fetching email template with name: ${templateName}`);
        try {
            const template = await this.emailTemplateRepository.getTemplateByName(templateName);
            if (!template) {
                this.logger.warn(`Email template with name ${templateName} not found`);
            } else {
                this.logger.info(`Email template found: ${template.templateName} (ID: ${template.id})`);
            }
            return template;
        } catch (error) {
            this.logger.error('Error fetching email template by name:', {
                templateName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async getTemplatesByType(templateType: string): Promise<EmailTemplate[]> {
        this.logger.info(`Fetching email templates with type: ${templateType}`);
        try {
            const templates = await this.emailTemplateRepository.getTemplatesByType(templateType);
            this.logger.info(`Retrieved ${templates.length} email templates for type: ${templateType}`);
            return templates;
        } catch (error) {
            this.logger.error('Error fetching email templates by type:', {
                templateType,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async processTemplate(
        templateName: string,
        data: Record<string, string>
    ): Promise<ProcessedEmailTemplate | null> {
        this.logger.info(`Processing email template: ${templateName}`, {
            placeholders: Object.keys(data)
        });

        try {
            const template = await this.emailTemplateRepository.getTemplateByName(templateName);

            if (!template) {
                this.logger.warn(`Template not found: ${templateName}`);
                return null;
            }

            // Replace placeholders in body and subject
            const processedBody = this.replacePlaceholders(template.body, data);
            const processedSubject = this.replacePlaceholders(template.subject, data);

            const processedTemplate: ProcessedEmailTemplate = {
                subject: processedSubject,
                body: processedBody,
                recipients: template.recipients,
                cc: template.cc,
                bcc: template.bcc,
                templateName: template.templateName,
                templateType: template.templateType
            };

            this.logger.info(`Template processed successfully: ${templateName}`, {
                recipientCount: template.recipients.length,
                ccCount: template.cc.length,
                bccCount: template.bcc.length
            });

            return processedTemplate;
        } catch (error) {
            this.logger.error('Error processing email template:', {
                templateName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async templateExists(templateName: string): Promise<boolean> {
        this.logger.info(`Checking if template exists: ${templateName}`);
        try {
            const template = await this.emailTemplateRepository.getTemplateByName(templateName);
            const exists = template !== null;
            this.logger.info(`Template ${templateName} exists: ${exists}`);
            return exists;
        } catch (error) {
            this.logger.error('Error checking template existence:', {
                templateName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
     * Replace placeholders in text with actual values
     * Supports formats: {{variable}}, {variable}, and [[variable]]
     * @param text Text containing placeholders
     * @param data Key-value pairs for replacement
     * @returns Text with placeholders replaced
     */
    private replacePlaceholders(text: string, data: Record<string, string>): string {
        let result = text;

        for (const [key, value] of Object.entries(data)) {
            // Support multiple placeholder formats
            const patterns = [
                new RegExp(`\\{\\{${key}\\}\\}`, 'g'),  // {{variable}}
                new RegExp(`\\{${key}\\}`, 'g'),         // {variable}
                new RegExp(`\\[\\[${key}\\]\\]`, 'g')   // [[variable]]
            ];

            patterns.forEach(pattern => {
                result = result.replace(pattern, value);
            });
        }

        // Log if there are unreplaced placeholders
        const remainingPlaceholders = result.match(/\{\{[^}]+\}\}|\{[^}]+\}|\[\[[^\]]+\]\]/g);
        if (remainingPlaceholders && remainingPlaceholders.length > 0) {
            this.logger.warn('Unreplaced placeholders found in template:', {
                placeholders: remainingPlaceholders
            });
        }

        return result;
    }
}