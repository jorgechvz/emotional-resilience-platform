import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:5173'],
    credentials: true, // Allow cookies to be sent with requests
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Emotional Resilience Platform API')
    .setDescription(
      'RESTful API for the Emotional Resilience Platform. This API provides endpoints for user management, emotional assessments, coping strategies, progress tracking, and personalized recommendations to help users build emotional resilience skills. Authentication is required for most endpoints.',
    )
    .setVersion('1.0')
    .addTag(
      'Authentication',
      'Endpoints related to user authentication and authorization',
    )
    .addTag(
      "Courses",
      "Endpoints realted to courses, including creation, retrieval, and management of courses designed to enhance emotional resilience.",
    )
    .addBearerAuth(
      {
        description: `Please enter a Bearer Token in this format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
