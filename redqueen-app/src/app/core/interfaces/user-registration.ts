import { UserLogin } from "./user-login";

export interface UserRegistration extends UserLogin {
  firstName: string;
  lastName: string;
}
