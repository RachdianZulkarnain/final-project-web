export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string;
  isVerified?: boolean;
  verificationSentAt?: string;
  provider?: Provider;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

export enum Provider {
  GOOGLE = "GOOGLE",
  CREDENTIAL = "CREDENTIAL",
}
