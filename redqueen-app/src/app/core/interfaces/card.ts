import { AccessControlUser } from "./access-control-user";

export interface Card {
  id: number;
  serial: string;
  createdDate: Date;
  modifiedDate?: Date;
  isActive: boolean;
  accessControlUserId?: number;
  user?: AccessControlUser;
}
