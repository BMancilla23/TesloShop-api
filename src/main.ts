import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  DatabaseExceptionFilter,
  GlobalHttpExceptionFilter,
} from '@/common/filters';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');

  // Set global prefix
  app.setGlobalPrefix('api');

  // Set global pipes
  app.useGlobalPipes(
    // Remove properties that are not in the DTO
    new ValidationPipe({
      transform: true, // Transform the payload to the DTO type
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if there are properties that are not in the DTO
    }),
  );

  app.useGlobalFilters(
    new GlobalHttpExceptionFilter(),
    new DatabaseExceptionFilter(),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);
  // Setup the Swagger UI
  SwaggerModule.setup('api', app, document);

  // Enable cors
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
