import { TransactionCallbackData } from '@/domain/interfaces/infrastructure/third-party/callbacks/send.callback.notification.request';

export interface ICallbackService {
  sendCallbackNotification(transactionCallbackData: TransactionCallbackData | any): Promise<boolean>;
}
