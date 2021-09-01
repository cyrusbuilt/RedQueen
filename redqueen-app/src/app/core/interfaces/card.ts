import { AccessControlUser } from "./access-control-user";

export interface Card {
  id: number;
  serial: string;
  createdDate: Date;
  isActive: boolean;
  accessControlUserId?: number;
  user?: AccessControlUser;
}
