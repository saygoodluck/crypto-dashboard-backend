import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'User', freezeTableName: true })
export class User extends Model {
  @Column({ allowNull: false, primaryKey: true, autoIncrement: true })
  public id: number;

  @Column({ allowNull: false })
  public username: string;

  @Column({ allowNull: false })
  public telegramId: number;

  @Column({ allowNull: true })
  public firstName: string;

  @Column({ allowNull: true })
  public lastName: string

  @CreatedAt
  @Column({ allowNull: false })
  public createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: true })
  public updatedAt: Date;
}
