import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('PORT');
  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}

bootstrap();
