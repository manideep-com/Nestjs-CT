import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('Commercetools E-commerce API')
    .setDescription('Complete e-commerce API with Commercetools integration. Includes authentication, product management, cart operations, and checkout functionality.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Bearer token (get it from /auth/guest-token endpoint)',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Auth', 'Authentication endpoints - Get and manage guest tokens')
    .addTag('Products', 'Product catalog endpoints - Browse and search products')
    .addTag('Cart', 'Shopping cart endpoints - Manage cart items')
    .addTag('Checkout', 'Checkout endpoints - Complete orders')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  
  console.log('📚 Swagger docs available at http://localhost:3000/api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 API Documentation: http://localhost:${port}/api`);
}

bootstrap();