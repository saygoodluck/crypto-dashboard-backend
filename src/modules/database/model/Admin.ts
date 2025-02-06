import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'Admin', freezeTableName: true })
export class Admin extends Model {
  @Column({ allowNull: false, primaryKey: true, autoIncrement: true })
  public id: number;

  @Column({ allowNull: false, unique: true })
  public email: string;

  @Column({ allowNull: false })
  public password: string;

  @Column({ defaultValue: false, allowNull: false })
  public isAdmin: boolean;

  @Column({ defaultValue: false, allowNull: false })
  public isRoot: boolean;

  @CreatedAt
  @Column({ allowNull: false })
  public createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: true })
  public updatedAt: Date;
}
