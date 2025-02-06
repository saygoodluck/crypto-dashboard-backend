import { InjectModel } from '@nestjs/sequelize';
import { User } from '../database/model/User';
import { Sequelize } from 'sequelize-typescript';

export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private sequelize: Sequelize
  ) {}

  async findOrCreate(telegramUser: any): Promise<User> {
    let user = await this.userRepository.findOne({ where: { telegramId: telegramUser.id } });
    if (!user) {
      user = new this.userRepository({
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        country: telegramUser.country,
      });
      await user.save();
    }
    return user;
  }
}
