import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../redis/cache.service';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../database/model/Admin';
import { User } from '../../database/model/User';

@Injectable()
export class AccountTypeGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Admin)
    private adminRepository: typeof Admin
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAccountTypes: string[] = this.reflector.get('allow-account', context.getHandler());

    if (!allowAccountTypes || allowAccountTypes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      if (allowAccountTypes.includes('nobody')) {
        return true;
      }
      throw new BadRequestException('Headers are needed');
    }

    let tokenPayload;
    try {
      tokenPayload = jwt.verify(
        request.headers.authorization,
        this.configService.get('SECRET').toString()
      ) as any;
    } catch (e) {
      throw new BadRequestException('Bad token');
    }

    const sessionId = tokenPayload.sessionId;

    const session = await this.cacheService.getSession(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.type === 'user') {
      const user = await this.userRepository.findOne({ where: { id: session.id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      request.user = user;
    } else if (session.type === 'admin') {
      const admin = await this.adminRepository.findOne({
        where: { id: session.id }
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      request.user = admin;
    }
    request.user.type = session.type;

    if (!allowAccountTypes.includes(session.type)) {
      throw new ForbiddenException('Wrong account type');
    }

    return true;
  }
}