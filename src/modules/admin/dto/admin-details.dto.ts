import { Admin } from '../../database/model/Admin';

export class AdminDetailsDto {
  public id: number;
  public email: string;
  public password: string;
  public isRoot: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(admin: Admin) {
    this.id = admin.id;
    this.email = admin.email;
    this.password = admin.password;
    this.isRoot = admin.isRoot;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
  }
}
