import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppErrorFilter } from './shared/errors/app-error.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AppErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('API Brain Agriculture')
    .setDescription('Api for managing rural producers')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
