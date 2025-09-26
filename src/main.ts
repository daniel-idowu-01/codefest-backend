import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Maternal Health Tracker API')
    .setDescription('Backend API for Maternal Health Tracker MVP')
    .setVersion('1.0')
    .addTag('visits', 'Antenatal visit management')
    .addTag('contacts', 'Emergency contacts')
    .addTag('location', 'Nearby hospitals and emergency services')
    .addTag('health', 'Health check endpoints')
    .build();

  const logger = new Logger('Main App');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Maternal Health Tracker API running on port ${port}`);
  logger.log(
    `API Documentation available at http://localhost:${port}/api`,
  );
  logger.log(
    `Google Maps API Key ${process.env.GOOGLE_MAPS_API_KEY ? 'Found' : 'Missing'}`,
  );
}
bootstrap();
