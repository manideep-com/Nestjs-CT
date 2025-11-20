import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    console.log('🚀 Starting Lambda...');
    
    const expressApp = express();

    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    nestApp.enableCors();

    console.log('✅ NestJS app created successfully');

    // 🎯 SWAGGER SETUP - Always enable in Lambda
    console.log('📚 Setting up Swagger...');
    
    const config = new DocumentBuilder()
      .setTitle('Commercetools E-commerce API')
      .setDescription('Complete e-commerce API with Commercetools integration. Includes authentication, product management, cart operations, and checkout functionality.')
      .setVersion('1.0')
      .addServer('https://7pq8pjtkp2.execute-api.us-east-1.amazonaws.com', 'AWS Lambda')
      .addServer('http://localhost:3000', 'Local Development')
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
    
    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Commercetools API Docs',
      customfavIcon: 'https://docs.nestjs.com/assets/logo-small.svg',
    });
    
    console.log('✅ Swagger enabled at /api');

    await nestApp.init();

    console.log('✅ NestJS app initialized');

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  console.log('📨 Received event:', event.httpMethod, event.path);
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const server = await bootstrap();
    return server(event, context, () => {});
  } catch (error) {
    console.error('❌ Lambda error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Internal Server Error',
        error: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      }),
    };
  }
};