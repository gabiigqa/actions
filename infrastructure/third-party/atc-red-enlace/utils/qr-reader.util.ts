import jsQR from 'jsqr';
import { Jimp } from 'jimp';
import {
    InvalidBase64Error,
    QRNotFoundError,
    ImageTooLargeError,
    UnsupportedFormatError,
    ImageCorruptedError,
    InternalQRError
} from '../errors/qr-extraction.errors';

/**
 * Utilidad para extraer texto de códigos QR desde imágenes
 * Soporta imágenes en formato Base64
 */

export interface QRReadResult {
    text: string;
    found: boolean;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];

/**
 * Extrae el texto de un código QR desde una imagen en Base64
 *
 * @param base64Image - Imagen en formato Base64 (con o sin prefijo data:image/...)
 * @returns Texto extraído del QR
 * @throws Error si no se encuentra QR o hay error al procesar
 */
export async function extractQRFromBase64(base64Image: string): Promise<string> {
    try {
        console.log('📸 Starting QR extraction from Base64 image...');

        // 1. Validar formato Base64
        let imageFormat: string | null = null;
        let base64Data: string;

        const dataUrlMatch = base64Image.match(/^data:image\/(\w+);base64,/);
        if (dataUrlMatch) {
            imageFormat = `image/${dataUrlMatch[1]}`;
            base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        } else {
            base64Data = base64Image;
        }

        // Validar que sea Base64 válido
        if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
            throw new InvalidBase64Error('The provided string is not a valid Base64 format');
        }

        console.log('  ✓ Base64 validated, length:', base64Data.length);

        // 2. Validar formato de imagen soportado
        if (imageFormat && !SUPPORTED_FORMATS.includes(imageFormat)) {
            throw new UnsupportedFormatError(`Format ${imageFormat} is not supported. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
        }

        // 3. Convertir Base64 a Buffer
        let buffer: Buffer;
        try {
            buffer = Buffer.from(base64Data, 'base64');
        } catch (error) {
            throw new InvalidBase64Error('Failed to decode Base64 string');
        }

        console.log('  ✓ Buffer created, size:', buffer.length, 'bytes');

        // 4. Validar tamaño de imagen
        if (buffer.length > MAX_IMAGE_SIZE) {
            throw new ImageTooLargeError(`Image size (${buffer.length} bytes) exceeds maximum allowed size (${MAX_IMAGE_SIZE} bytes)`);
        }

        // 5. Cargar imagen con Jimp
        let image;
        try {
            image = await Jimp.read(buffer);
        } catch (error) {
            throw new ImageCorruptedError('Failed to load image. The image may be corrupted or in an invalid format');
        }

        console.log('  ✓ Image loaded:', image.bitmap.width, 'x', image.bitmap.height, 'px');

        // 6. Obtener datos de píxeles en formato RGBA
        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height
        };
        console.log('  ✓ Image data prepared for jsQR');

        // 7. Leer QR con jsQR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
        });

        if (!code) {
            console.log('  ✗ No QR code found in image');
            throw new QRNotFoundError('No QR code detected in the provided image. Please ensure the image contains a valid QR code');
        }

        console.log('  ✓ QR code found!');
        console.log('  ✓ QR text length:', code.data.length, 'characters');
        console.log('  ✓ QR text preview:', code.data.substring(0, 50) + '...');

        return code.data;

    } catch (error) {
        console.error('❌ Error extracting QR:', error);

        // Si ya es un error personalizado, lanzarlo directamente
        if (error instanceof InvalidBase64Error ||
            error instanceof QRNotFoundError ||
            error instanceof ImageTooLargeError ||
            error instanceof UnsupportedFormatError ||
            error instanceof ImageCorruptedError) {
            throw error;
        }

        // Para errores no manejados, lanzar error interno
        if (error instanceof Error) {
            throw new InternalQRError(`Unexpected error: ${error.message}`);
        }

        throw new InternalQRError('Unknown error occurred while extracting QR code');
    }
}

/**
 * Valida que una imagen Base64 sea válida
 *
 * @param base64Image - String a validar
 * @returns true si es válido
 */
export function isValidBase64Image(base64Image: string): boolean {
    try {
        // Limpiar prefijo
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Intentar crear buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Verificar que no esté vacío
        return buffer.length > 0;
    } catch {
        return false;
    }
}
