import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { getAbsolutePath } from './utils/path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(`${getAbsolutePath()}/ssl/cert.pem`),
    cert: fs.readFileSync(`${getAbsolutePath()}/ssl/privkey.pem`)
  };
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' }, httpsOptions });
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('PORT');
  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}

bootstrap();
