/**
 * Mapea errores de ATC Payout a códigos de error genéricos
 *
 * IMPORTANTE: Este mapeador oculta que estamos usando ATC como proveedor.
 * Nunca debemos exponer códigos o mensajes de error de ATC al cliente.
 */

export interface MappedError {
    code: string;
    message: string;
    httpStatus: number;
}

/**
 * Códigos de error de ATC conocidos y sus mapeos
 */
const ATC_ERROR_MAPPINGS: Record<string, MappedError> = {
    'PQ-00005': {
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient balance to complete this transaction. Please ensure you have enough funds in your account.',
        httpStatus: 400
    },
    'TR-00007': {
        code: 'TRANSACTION_ALREADY_PROCESSED',
        message: 'This transaction has already been processed and cannot be confirmed again.',
        httpStatus: 400
    },
    'TR-00001': {
        code: 'INVALID_TRANSACTION',
        message: 'The transaction reference is invalid or does not exist.',
        httpStatus: 404
    },
    'TR-00002': {
        code: 'TRANSACTION_EXPIRED',
        message: 'The transaction has expired and can no longer be processed.',
        httpStatus: 400
    },
    'QR-00001': {
        code: 'INVALID_QR_CODE',
        message: 'The QR code is invalid or cannot be processed.',
        httpStatus: 400
    },
    'QR-00002': {
        code: 'QR_EXPIRED',
        message: 'The QR code has expired. Please generate a new one.',
        httpStatus: 400
    },
    'AC-00001': {
        code: 'INVALID_ACCOUNT',
        message: 'The destination account is invalid or does not exist.',
        httpStatus: 400
    },
    'SY-00001': {
        code: 'SYSTEM_ERROR',
        message: 'A system error occurred while processing your request. Please try again later.',
        httpStatus: 500
    }
};

/**
 * Error por defecto cuando no reconocemos el código de ATC
 */
const DEFAULT_ERROR: MappedError = {
    code: 'PAYMENT_PROCESSING_ERROR',
    message: 'An error occurred while processing the payment. Please try again later or contact support.',
    httpStatus: 500
};

/**
 * Extrae el código de error de ATC del mensaje de error
 * Formatos soportados:
 * - "[PQ-00005] Saldo insuficiente para realizar esta transacción"
 * - "ATC Payout returned error: [PQ-00005] Saldo insuficiente..."
 * - "Error in encrypted request to ATC Payout: ATC Payout returned error: [PQ-00005]..."
 */
function extractATCErrorCode(errorMessage: string): string | null {
    const regex = /\[([A-Z]{2}-\d{5})\]/;
    const match = errorMessage.match(regex);
    return match ? match[1] : null;
}

/**
 * Mapea un error de ATC Payout a un error genérico
 * @param error - Error original de ATC o mensaje de error
 * @returns Error mapeado con código y mensaje genéricos
 */
export function mapATCError(error: Error | string): MappedError {
    const errorMessage = typeof error === 'string' ? error : error.message;

    // Extraer código de error de ATC
    const atcErrorCode = extractATCErrorCode(errorMessage);

    if (atcErrorCode && ATC_ERROR_MAPPINGS[atcErrorCode]) {
        return ATC_ERROR_MAPPINGS[atcErrorCode];
    }

    // Si no reconocemos el código, retornar error genérico
    return DEFAULT_ERROR;
}

/**
 * Verifica si un mensaje de error contiene información de ATC que debe ser ocultada
 * @param errorMessage - Mensaje de error a verificar
 * @returns true si el mensaje contiene referencias a ATC
 */
export function containsATCReference(errorMessage: string): boolean {
    const atcPatterns = [
        /ATC Payout/i,
        /ATC/i,
        /encrypted request/i,
        /\[([A-Z]{2}-\d{5})\]/
    ];

    return atcPatterns.some(pattern => pattern.test(errorMessage));
}

/**
 * Sanitiza un mensaje de error removiendo cualquier referencia a ATC
 * @param errorMessage - Mensaje de error a sanitizar
 * @returns Mensaje sanitizado
 */
export function sanitizeErrorMessage(errorMessage: string): string {
    if (containsATCReference(errorMessage)) {
        const mappedError = mapATCError(errorMessage);
        return mappedError.message;
    }

    return errorMessage;
}