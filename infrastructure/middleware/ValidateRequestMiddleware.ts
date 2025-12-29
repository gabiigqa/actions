import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

// Factory that accepts an array of ValidationChain and returns an Express middleware
// that runs validations and returns a standardized error response when validation fails.
export function validateRequest(validations: ValidationChain[]): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const details: Record<string, string> = {};
    errors.array().forEach((err) => {
      const param = (err as any).param || (err as any).location || 'field';
      const msg = (err as any).msg || String(err);
      if (!details[param]) {
        details[param] = msg;
      }
    });

    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details,
    });
  };
}

// Backwards-compatible default export
export default validateRequest;
