export interface IAuthDocumentNew {
  username: string;
  password: string;
  profilePublicId: string;
  email: string;
  country: string;
  profilePicture: string;
  emailVerificationToken: string;
  emailVerified: boolean;
  browserName: string;
  deviceType: string;
  otp?: string; // Optional
  otpExpiration?: Date; // Optional
  createdAt?: Date; // Optional, will be auto-set by the database
  passwordResetToken?: string; // Optional
  passwordResetExpires?: Date; // Optional
}
