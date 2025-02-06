import { CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../redis/cache.service';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../database/model/Admin';
import { User } from '../../database/model/User';

export class AccountRightsGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @InjectModel(Admin)
    private adminRepository: typeof Admin,
    @InjectModel(User)
    private userRepository: typeof User
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowRights: string[] = this.reflector.get('allow-rights', context.getHandler());

    if (!allowRights || allowRights.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (request.user.type === 'user') {
      return true;
    }

    const admin = await this.adminRepository.findOne({
      where: { id: request.user.id }
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.isRoot) {
      return true;
    }

    return true;
  }
}
