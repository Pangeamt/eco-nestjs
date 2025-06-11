import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Bootstrap');

  

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(envs.PORT);


  logger.log(`Server is running on port ${envs.PORT}`);
}
bootstrap();
