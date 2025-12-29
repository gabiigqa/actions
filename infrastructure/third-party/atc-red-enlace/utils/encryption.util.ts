import crypto from 'crypto';

/**
 * Utilidad para cifrado híbrido RSA + AES-GCM según especificación ATC Payout QR
 *
 * Esquema:
 * - RSA 2048 bits con OAEP (SHA-256, MGF1 SHA-256) para cifrar clave AES
 * - AES-256 en modo GCM (autenticación integrada) para cifrar payload
 */

export interface EncryptedPayload {
    encryptedData: string;    // Base64 del payload cifrado con AES-GCM
    encryptedKey: string;     // Base64 de la clave AES cifrada con RSA-OAEP
    iv: string;               // Base64 del IV (12 bytes)
}

export interface DecryptedPayload {
    data: any;  // JSON parseado del payload descifrado
}

/**
 * Cifra un payload usando el esquema híbrido RSA + AES-GCM
 * @param payload - Objeto JavaScript a cifrar
 * @param publicKeyPem - Clave pública RSA de ATC en formato PEM
 * @returns EncryptedPayload con datos cifrados
 */
export function encryptPayload(payload: any, publicKeyPem: string): EncryptedPayload {
    try {
        // DEBUG: Log the actual public key being used for encryption
        console.log('🔐 DEBUG: encryptPayload() - Public Key Details:');
        console.log('  Length:', publicKeyPem.length);
        console.log('  First 100 chars:', publicKeyPem.substring(0, 100));
        console.log('  Has literal \\n:', publicKeyPem.includes('\\n'));
        console.log('  Has actual newlines:', publicKeyPem.includes('\n'));
        console.log('  Starts with quote:', publicKeyPem.startsWith('"'));
        console.log('  Ends with quote:', publicKeyPem.endsWith('"'));

        // 1. Convertir payload a JSON string
        const payloadString = JSON.stringify(payload);

        // 2. Generar clave AES-256 aleatoria (32 bytes)
        const aesKey = crypto.randomBytes(32);

        // 3. Generar IV de 12 bytes aleatorio para AES-GCM
        const iv = crypto.randomBytes(12);

        // 4. Cifrar payload con AES-GCM
        const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
        let encryptedData = cipher.update(payloadString, 'utf8', 'base64');
        encryptedData += cipher.final('base64');

        // Obtener el tag de autenticación (GCM genera un tag de 128 bits)
        const authTag = cipher.getAuthTag();

        // Concatenar datos cifrados + tag de autenticación
        const encryptedDataWithTag = Buffer.concat([
            Buffer.from(encryptedData, 'base64'),
            authTag
        ]).toString('base64');

        // 5. Cifrar clave AES con RSA-OAEP
        const encryptedKey = crypto.publicEncrypt(
            {
                key: publicKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            aesKey
        ).toString('base64');

        return {
            encryptedData: encryptedDataWithTag,
            encryptedKey: encryptedKey,
            iv: iv.toString('base64')
        };
    } catch (error) {
        throw new Error(`Error encrypting payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Descifra un payload usando el esquema híbrido RSA + AES-GCM
 * @param encryptedPayload - Payload cifrado recibido de ATC
 * @param privateKeyPem - Clave privada RSA propia en formato PEM
 * @returns Objeto JavaScript descifrado
 */
export function decryptPayload(encryptedPayload: EncryptedPayload, privateKeyPem: string): any {
    try {
        // 1. Descifrar clave AES con RSA-OAEP usando clave privada
        const aesKey = crypto.privateDecrypt(
            {
                key: privateKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            Buffer.from(encryptedPayload.encryptedKey, 'base64')
        );

        // 2. Decodificar IV
        const iv = Buffer.from(encryptedPayload.iv, 'base64');

        // 3. Separar datos cifrados y auth tag
        const encryptedDataBuffer = Buffer.from(encryptedPayload.encryptedData, 'base64');
        const authTagSize = 16; // 128 bits = 16 bytes
        const authTag = encryptedDataBuffer.slice(-authTagSize);
        const encryptedData = encryptedDataBuffer.slice(0, -authTagSize);

        // 4. Descifrar con AES-GCM
        const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
        decipher.setAuthTag(authTag);

        let decryptedData = decipher.update(encryptedData, undefined, 'utf8');
        decryptedData += decipher.final('utf8');

        // 5. Parsear JSON
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new Error(`Error decrypting payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Genera un par de claves RSA 2048 bits
 * Útil para testing o generación inicial de claves
 */
export function generateRSAKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    return { publicKey, privateKey };
}
