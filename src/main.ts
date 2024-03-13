import swaggerInit from './swagger';
import { AppEnvironmentService } from './common/environment';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  });
  const envService = app.get(AppEnvironmentService);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (error) => {
        return new BadRequestException(error);
      },
    }),
  );
  await swaggerInit(app);
  const API_PORT = envService.ENVIRONMENT.API_PORT;
  await app.listen(API_PORT);
  console.log(`App is running on ${API_PORT}`);
  console.log(`http://127.0.0.1:${API_PORT}/docs`);
}

(async () => {
  await bootstrap();
})();
