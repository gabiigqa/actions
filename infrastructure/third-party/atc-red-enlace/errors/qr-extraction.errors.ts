export class QRExtractionError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(message: string, code: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ImageRequiredError extends QRExtractionError {
    constructor(message = 'Image is required') {
        super(message, 'IMAGE_REQUIRED', 400);
    }
}

export class InvalidBase64Error extends QRExtractionError {
    constructor(message = 'Invalid Base64 image format') {
        super(message, 'INVALID_BASE64', 400);
    }
}

export class QRNotFoundError extends QRExtractionError {
    constructor(message = 'No QR code found in the provided image') {
        super(message, 'QR_NOT_FOUND', 400);
    }
}

export class ImageTooLargeError extends QRExtractionError {
    constructor(message = 'Image size exceeds maximum allowed size') {
        super(message, 'IMAGE_TOO_LARGE', 413);
    }
}

export class UnsupportedFormatError extends QRExtractionError {
    constructor(message = 'Unsupported image format') {
        super(message, 'UNSUPPORTED_FORMAT', 415);
    }
}

export class ImageCorruptedError extends QRExtractionError {
    constructor(message = 'Image is corrupted or cannot be processed') {
        super(message, 'IMAGE_CORRUPTED', 422);
    }
}

export class InternalQRError extends QRExtractionError {
    constructor(message = 'Internal error processing QR code') {
        super(message, 'INTERNAL_ERROR', 500);
    }
}
