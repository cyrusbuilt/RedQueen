export interface AccessControlUser {
  id: number;
  name: string;
  pin: string;
  isActive: boolean;
  createdDate: Date;
  modifiedDate?: Date;
}
