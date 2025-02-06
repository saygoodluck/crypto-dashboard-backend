import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: IncomingMessage): Promise<string> {
    return req.headers['x-forwarded-for'] as any;
  }
}
