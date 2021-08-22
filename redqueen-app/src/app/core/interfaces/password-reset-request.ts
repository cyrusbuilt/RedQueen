export interface PasswordResetRequest {
  userId: string;
  token: string;
  newPassword: string;
}
