import { JwtPayload } from "@/domain/interfaces/domain/entities/JwtPayload";


export interface TokenValidationResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
}
