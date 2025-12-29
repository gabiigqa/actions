import { IEmailTemplateService } from '@/domain/interfaces/domain/services/IEmailTemplateService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { CallbackNotificationResponse, TransactionCallbackData } from '@/domain/interfaces/infrastructure/third-party/callbacks/send.callback.notification.request';
import { CallbackConnector } from '@/infrastructure/third-party/callbacks/callback.connector';
import { ICallbackService } from '@domain/interfaces/domain/services/ICallbackService';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';
import { IQueueManagerService } from '../interfaces/domain/services/third-party/queue.manager.service.interface';
import { ITransactionService } from '@/domain/interfaces/domain/services/ITransacctionService';

@injectable()
export class CallbackService implements ICallbackService {
  constructor(
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
    @inject(TYPES.CallbackConnector) private callbackConnector: CallbackConnector,
    @inject(TYPES.IQueueManagerService) private queueManagerService: IQueueManagerService,
    @inject(TYPES.IEmailTemplateService) private emailTemplateService: IEmailTemplateService,
    @inject(TYPES.ITransactionService) private transactionService: ITransactionService
  ) { }

  public async sendCallbackNotification(transactionCallbackData: TransactionCallbackData | any): Promise<boolean> {
    const response: CallbackNotificationResponse | null = await this.callbackConnector.sendCallbackNotification(transactionCallbackData);

    this.loggerService.info('Callback notification processed', { response });

    try {
      this.loggerService.info('Sending email notification for callback processing');

      let templateData = await this.emailTemplateService.getTemplateByName('QR_PAYMENT_STAKEHOLDER');

      if (!templateData) {
        this.loggerService.warn('Email template "QR_PAYMENT_STAKEHOLDER" not found');
        return false;
      }

      let transactionData = await this.transactionService.getTransacctionById(transactionCallbackData.transactionId);

      if (!transactionData) {
        this.loggerService.warn(`Transaction data not found for ID: ${transactionCallbackData.transactionId}`);
        return false;
      }

      const processedTemplate = await this.emailTemplateService.processTemplate('QR_PAYMENT_STAKEHOLDER', {
        'client_name': transactionData.external_reference || 'Client - Mesa de Pagos',
        'monto_fiat': transactionData.total_fiat_amount.toFixed(2) || '0',
        'code_fiat': transactionData.fiat_currency_code || 'USD',
        'ID': transactionData.transaction_id || 'N/A',
        'monto_asset': transactionData.asset_amount.toFixed(2) || '0',
        'exchange_rate': transactionData.exchange_rate.toFixed(2) || '0',
        'monto_fee': transactionData.fees.toFixed(2) || '0',
        'code_asset': transactionData.asset_currency_code || 'USDC'
      });

      if (!processedTemplate) {
        this.loggerService.warn('Failed to process email template "QR_PAYMENT_STAKEHOLDER"');
        return false;
      }

      const emailResponse = await this.queueManagerService.setMailNotificationToQueue({
        to: processedTemplate.recipients.join(', '),
        subject: processedTemplate.subject,
        text: processedTemplate.body,
      });
      if (!emailResponse) {
        this.loggerService.warn('Failed to queue email notification for callback processing');
      } else {
        this.loggerService.info('Email notification queued for callback processing');
      }
    } catch (error) {
      this.loggerService.error('Error queuing email notification for callback processing', error);
    }
    if (!response) return true;

    return response.existEventNotification ? response.isResponseOk : true;
  }
}
