import { User } from '../../database/model/User';

export class UserDetailsDto {
  public id: number;
  public email: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public telegramId: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.telegramId = user.telegramId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
