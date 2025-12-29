import { User } from "@/domain/interfaces/domain/entities/User";

export interface Business {
  id: string;
  name: string;
  email: string;
  phoneContact?: string;
  status: string;
  createdAt: Date;

  userData?: User;
}