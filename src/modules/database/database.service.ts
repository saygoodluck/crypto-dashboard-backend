import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';

import { getAbsolutePath } from '../../utils/path';

@Injectable()
export default class DatabaseService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  public async onModuleInit(): Promise<void> {
    await this.applyMigrations();
  }

  private async applyMigrations(): Promise<void> {
    const { SequelizeStorage } = await import('umzug');

    const umzug = new Umzug({
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      migrations: {
        glob: `${getAbsolutePath()}/migrations/*.js`,
        resolve: ({ name, path, context }) => {
          const migration = require(path!);
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize)
          };
        }
      },
      context: this.sequelize.getQueryInterface(),
      logger: console
    });

    await umzug.up();
  }
}