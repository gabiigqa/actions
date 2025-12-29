import { EmailTemplate } from '@/domain/interfaces/infrastructure/repositories/IEmailTemplateRepository';

/**
 * Interface for Email Template Service
 * Provides business logic for email template management and processing
 */
export interface IEmailTemplateService {
    /**
     * Get all available email templates
     */
    getAllTemplates(): Promise<EmailTemplate[]>;

    /**
     * Get email template by ID
     * @param id Template ID
     */
    getTemplateById(id: number): Promise<EmailTemplate | null>;

    /**
     * Get email template by internal name
     * @param templateName Internal template name (e.g., "deposito_stakeholders")
     */
    getTemplateByName(templateName: string): Promise<EmailTemplate | null>;

    /**
     * Get email templates by category/type
     * @param templateType Template category (e.g., "stakeholders", "cliente")
     */
    getTemplatesByType(templateType: string): Promise<EmailTemplate[]>;

    /**
     * Process template by replacing placeholders with actual data
     * @param templateName Internal template name
     * @param data Key-value pairs to replace placeholders
     * @returns Processed email with subject, body, and recipients
     */
    processTemplate(
        templateName: string,
        data: Record<string, string>
    ): Promise<ProcessedEmailTemplate | null>;

    /**
     * Validate if a template exists
     * @param templateName Internal template name
     */
    templateExists(templateName: string): Promise<boolean>;
}

/**
 * Processed email template ready to send
 */
export interface ProcessedEmailTemplate {
    subject: string;
    body: string;
    recipients: string[];
    cc: string[];
    bcc: string[];
    templateName: string;
    templateType: string | null;
}
