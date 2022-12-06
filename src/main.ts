import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true
  }))

  await app.listen(3000);
}
bootstrap();
