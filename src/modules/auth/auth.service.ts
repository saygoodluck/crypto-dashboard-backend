import { InjectModel } from '@nestjs/sequelize';
import { User } from '../database/model/User';
import { Admin } from '../database/model/Admin';
import { BadRequestException } from '@nestjs/common';
import { CacheService } from '../redis/cache.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
// import { parse } from 'node-html-parser';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
// import { EventService } from '../event/event.service';
// import { EventsList } from '../../utils/event.list';

export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Admin)
    private adminRepository: typeof Admin,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  public async generateToken(user: User): Promise<string> {
    // let user;

    // if (loginUser.type === 'user') {
    //   user = await this.userRepository.findOne({ where: { email: loginUser.email } });
    // } else if (loginUser.type === 'admin') {
    //   user = await this.adminRepository.findOne({ where: { email: loginUser.email } });
    // } else {
    //   throw new BadRequestException(`Unknown user type: ${loginUser.type}`);
    // }

    // if (!user) {
    //   throw new BadRequestException('Wrong email');
    // }
    //
    // if (!(await bcrypt.compare(loginUser.password, user.password))) {
    //   throw new BadRequestException('Wrong password');
    // }

    // if (user.blocked === true) {
    //   throw new BadRequestException('This user is blocked');
    // }

    const sessionToken = await this.cacheService.createSession({
      id: user.id,
      type: 'user'
    });

    return jwt.sign({ sessionId: sessionToken }, this.configService.get('SECRET') as string);
  }

  public async logout(jwtToken: string): Promise<void> {
    let sessionId;
    try {
      const session = jwt.verify(jwtToken, this.configService.get('SECRET').toString()) as any;
      sessionId = session.sessionId;
    } catch (e) {}

    if (!sessionId) {
      throw new BadRequestException('Wrong token');
    }

    const session = await this.cacheService.getSession(sessionId);

    if (!session) {
      throw new BadRequestException('Session does not exist');
    }

    await this.cacheService.deleteSession(sessionId);

    let user;
    if (session.type === 'admin') {
      user = await this.adminRepository.findOne({ where: { id: session.id } });
    }
    if (session.type === 'user') {
      user = await this.userRepository.findOne({ where: { id: session.id } });
    }
  }

  // public async logoutAll(jwtToken: string, user: any): Promise<void> {
  //   let sessionId;
  //   try {
  //     const session = jwt.verify(jwtToken, this.configService.get('SECRET').toString()) as any;
  //     sessionId = session.sessionId;
  //   } catch (e) {}
  //
  //   if (!sessionId) {
  //     throw new BadRequestException('Wrong token');
  //   }

    // const sessionTokens: string[] = await this.cacheService.getSessionsByTypeId(user.type, user.id);

  //   if (!sessionTokens) {
  //     throw new BadRequestException('Session does not exist');
  //   }
  //
  //   return await this.cacheService.deleteSession(...sessionTokens);
  // }

  // public async checkUser(data: CheckUserDto): Promise<void> {
  //   const user = await this.userRepository.findOne({ where: { email: data.email } });
  //   if (!data.password) {
  //     if (user) {
  //       throw new BadRequestException('User with this email already exist');
  //     }
  //     return;
  //   }
  //   if (!user) {
  //     throw new BadRequestException('User with this email does not exist');
  //   }
  //   if (!(await bcrypt.compare(data.password, user.password))) {
  //     throw new BadRequestException('Wrong password for user with this email');
  //   }
  // }
}
