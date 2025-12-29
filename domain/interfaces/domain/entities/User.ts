export interface User {
  id: string;
  businessId: string;
  username: string;
  passwordHash: string;
  status: string;
  createdAt: Date;
}