import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Commercetools E-commerce API',
      version: '1.0',
      endpoints: {
        swagger: '/api',
        health: '/health',
        auth: '/auth',
        products: '/products',
        cart: '/cart',
        checkout: '/checkout',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.STAGE || 'unknown',
    };
  }
}