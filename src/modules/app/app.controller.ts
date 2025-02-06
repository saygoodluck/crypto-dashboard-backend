import { All, Controller, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {

  @All()
  public healthCheck(@Req() req: Request): { request: any; data: string } {
    return {
      request: { method: req.method, body: req.body, headers: req.headers, url: req.url },
      data: "it's alive!"
    };
  }
}