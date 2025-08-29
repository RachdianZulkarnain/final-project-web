export enum Role {
  USER = "USER",
  TENANT = "TENANT",
}

export enum Provider {
  GOOGLE = "GOOGLE",
  CREDENTIAL = "CREDENTIAL",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  imageUrl?: string;
  isVerified: boolean;
  provider: Provider;
  verificationSentAt?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: number;
  name: string;
  imageUrl?: string;
  phone?: string;
  bankName?: string;
  bankNumber?: string;
  userId: number;
}
