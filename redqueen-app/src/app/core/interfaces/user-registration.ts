import { UserLogin } from "./user-login";

export interface UserRegistration extends UserLogin {
  email: string;
  phone: string;
}
