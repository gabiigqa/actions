import { EncryptedPayload } from '../utils/encryption.util';

/**
 * Wrapper de respuesta de ATC Payout
 * Todas las respuestas de ATC vienen en este formato
 */
export interface ATCPayoutResponseWrapper<T = any> {
    data: EncryptedPayload | null;  // Datos cifrados (null si hay error)
    code: '00' | '05';              // '00' = éxito, '05' = error
    errorCode: string;              // Código de error (ej: "TR-00007")
    errorMessage: string;           // Mensaje de error
}

/**
 * Códigos de respuesta ATC
 */
export enum ATCPayoutResponseCode {
    SUCCESS = '00',
    ERROR = '05'
}
