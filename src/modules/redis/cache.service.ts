import { BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  id: number;
  type: string;
}

export class CacheService {
  public constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async createSession(data: SessionData): Promise<string> {
    const sessionToken: string = uuidv4();
    await this.cacheManager.set(`${sessionToken}`, data);
    return sessionToken;
  }

  public async getSession(token: string): Promise<SessionData | undefined> {
    const sessionData = await this.cacheManager.get<SessionData>(token);

    if (!sessionData) {
      throw new BadRequestException(`Token with id: ${token} not found`);
    }

    return sessionData;
  }

  // public async getSessionsByTypeId(type: string, id: number): Promise<string[]> {
  //   const keys: string[] = await this.cacheManager.store.keys(`${type[0]}${id} *`);
  //   return keys.map((key) => key.split(' ')[1]);
  // }

  public async deleteSession(...tokens: string[]): Promise<void> {
    await Promise.allSettled(
      tokens.map(async (token) => {
        const key = `session:${token}`;
        await this.cacheManager.del(key);
      })
    );
  }
}
