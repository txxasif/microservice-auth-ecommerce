export interface IAuthDocumentNew {
  id?: number;
  username: string;
  password: string;
  profilePublicId: string;
  email: string;
  country: string;
  profilePicture: string;
  emailVerificationToken: string;
  emailVerified?: boolean;
  browserName: string;
  deviceType: string;
  otp?: string | undefined; // Optional
  otpExpiration?: Date | undefined; // Optional
  createdAt?: Date; // Optional, will be auto-set by the database
  passwordResetToken?: string | undefined; // Optional
  passwordResetExpires?: Date | undefined; // Optional
}
