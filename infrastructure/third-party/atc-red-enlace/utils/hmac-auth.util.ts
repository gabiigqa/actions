import crypto from 'crypto';

/**
 * Utilidad para autenticación HMAC-SHA256 según especificación ATC Payout QR
 *
 * Genera los headers necesarios:
 * - Date (RFC1123)
 * - Digest (SHA-256 del body)
 * - Signature (HMAC-SHA256 de headers específicos)
 */

export interface HMACHeaders {
    Date: string;
    'branch-id': string;
    Digest: string;
    Signature: string;
}

export interface HMACConfig {
    keyId: string;           // Identificador de cliente proporcionado por ATC
    sharedSecret: string;    // Clave secreta compartida (Base64)
    branchId: string;        // Código de comercio asignado por ATC
}

/**
 * Genera la fecha en formato RFC1123
 * Ejemplo: "Wed, 21 Oct 2023 07:28:00 GMT"
 */
export function generateRFC1123Date(): string {
    return new Date().toUTCString();
}

/**
 * Calcula el Digest (SHA-256 del body)
 * @param body - Cuerpo de la solicitud (objeto JavaScript)
 * @returns Digest en formato "SHA-256=<base64>"
 */
export function calculateDigest(body: any): string {
    const bodyString = JSON.stringify(body);
    const hash = crypto.createHash('sha256').update(bodyString, 'utf8').digest('base64');
    return `SHA-256=${hash}`;
}

/**
 * Construye la cadena de firma (signing string)
 * @param config - Configuración HMAC
 * @param date - Fecha RFC1123
 * @param requestTarget - request-target (ej: "post /api/v1/payout/qr/scan")
 * @param digest - Digest calculado
 * @param host - Host del servidor ATC
 * @returns Cadena de firma
 */
function buildSigningString(
    config: HMACConfig,
    date: string,
    requestTarget: string,
    digest: string,
    host: string
): string {
    return `host: ${host}\ndate: ${date}\n(request-target): ${requestTarget}\nbranch-id: ${config.branchId}\ndigest: ${digest}`;
}

/**
 * Calcula la firma HMAC-SHA256
 * @param signingString - Cadena a firmar
 * @param sharedSecret - Clave secreta compartida (Base64)
 * @returns Firma en Base64
 */
function calculateSignature(signingString: string, sharedSecret: string): string {
    const secretBuffer = Buffer.from(sharedSecret, 'base64');
    const hmac = crypto.createHmac('sha256', secretBuffer);
    hmac.update(signingString, 'utf8');
    return hmac.digest('base64');
}

/**
 * Genera el header Signature completo
 * @param keyId - Identificador de cliente
 * @param signature - Firma calculada
 * @returns Header Signature formateado
 */
function buildSignatureHeader(keyId: string, signature: string): string {
    return `keyid="${keyId}", algorithm="HmacSHA256", headers="host date (request-target) branch-id digest", signature="${signature}"`;
}

/**
 * Genera todos los headers HMAC necesarios para una petición
 * @param config - Configuración HMAC
 * @param method - Método HTTP (POST, GET, etc.)
 * @param path - Path de la API (ej: "/api/v1/payout/qr/scan")
 * @param host - Host del servidor (ej: "atcsindev.redenlace.com.bo")
 * @param body - Cuerpo de la solicitud
 * @returns Headers HMAC completos
 */
export function generateHMACHeaders(
    config: HMACConfig,
    method: string,
    path: string,
    host: string,
    body: any
): HMACHeaders {
    // 1. Generar fecha RFC1123
    const date = generateRFC1123Date();

    // 2. Calcular Digest
    const digest = calculateDigest(body);

    // 3. Construir request-target (método en minúsculas + path)
    const requestTarget = `${method.toLowerCase()} ${path}`;

    // 4. Construir cadena de firma
    const signingString = buildSigningString(config, date, requestTarget, digest, host);

    // 5. Calcular firma
    const signature = calculateSignature(signingString, config.sharedSecret);

    // 6. Construir header Signature completo
    const signatureHeader = buildSignatureHeader(config.keyId, signature);

    // Log para debug
    console.log('🔐 HMAC Debug:');
    console.log('  Host:', host);
    console.log('  Date:', date);
    console.log('  Request-Target:', requestTarget);
    console.log('  Branch-ID:', config.branchId);
    console.log('  Digest:', digest);
    console.log('  Signing String:\n', signingString);
    console.log('  Signature Header:', signatureHeader);

    return {
        Date: date,
        'branch-id': config.branchId,
        Digest: digest,
        Signature: signatureHeader
    };
}

/**
 * Valida que la fecha no difiera en más de ±5 minutos
 * @param dateString - Fecha en formato RFC1123
 * @returns true si la fecha es válida
 */
export function validateDateHeader(dateString: string): boolean {
    const requestDate = new Date(dateString);
    const now = new Date();
    const diff = Math.abs(now.getTime() - requestDate.getTime());
    const fiveMinutesInMs = 5 * 60 * 1000;

    return diff <= fiveMinutesInMs;
}
