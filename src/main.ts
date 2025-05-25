import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv, currentEnv, loadEnv } from './core/utils/env.util';
import { logger } from './core/utils/log.util';
import { ValidationPipe } from '@nestjs/common';
import {
  GlobalExceptionFilter,
  TransformInterceptor,
} from './core/utils/dispatchers';

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
    abortOnError: false,
    bufferLogs: true,
  });

  app.useLogger(logger);
  app.enableCors();

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const port = getEnv('BACKEND_PORT');
  app.listen(port, () =>
    logger.log(
      `Server started port=${port}, url=http://0.0.0.0:${port}, env=${currentEnv()}`,
    ),
  );
}
bootstrap();
