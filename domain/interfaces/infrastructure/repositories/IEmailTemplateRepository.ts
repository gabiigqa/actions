export interface EmailTemplate {
    id: number;
    templateName: string;
    subject: string;
    recipients: string[];
    cc: string[];
    bcc: string[];
    body: string;
    templateType: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmailTemplateRepository {
    /**
     * Get all email templates
     */
    getAllTemplates(): Promise<EmailTemplate[]>;

    /**
     * Get email template by ID
     * @param id Template ID
     */
    getTemplateById(id: number): Promise<EmailTemplate | null>;

    /**
     * Get email template by name
     * @param templateName Internal template name
     */
    getTemplateByName(templateName: string): Promise<EmailTemplate | null>;

    /**
     * Get email templates by type
     * @param templateType Template category (ej: 'stakeholders', 'cliente')
     */
    getTemplatesByType(templateType: string): Promise<EmailTemplate[]>;
}
