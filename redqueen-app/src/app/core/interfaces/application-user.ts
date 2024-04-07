import { UserRoles } from "../enum/user-roles";

export interface User {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  passwordHash: string | null;
  role: UserRoles;
  lockoutEnabled: boolean;
}
