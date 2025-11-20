"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = __importDefault(require("express"));
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
let cachedServer;
async function bootstrap() {
    if (!cachedServer) {
        console.log('🚀 Starting Lambda...');
        const expressApp = (0, express_1.default)();
        const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        nestApp.enableCors();
        console.log('✅ NestJS app created successfully');
        console.log('📚 Setting up Swagger...');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Commercetools E-commerce API')
            .setDescription('Complete e-commerce API with Commercetools integration. Includes authentication, product management, cart operations, and checkout functionality.')
            .setVersion('1.0')
            .addServer('https://7pq8pjtkp2.execute-api.us-east-1.amazonaws.com', 'AWS Lambda')
            .addServer('http://localhost:3000', 'Local Development')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter your Bearer token (get it from /auth/guest-token endpoint)',
            in: 'header',
        }, 'bearer')
            .addTag('Auth', 'Authentication endpoints - Get and manage guest tokens')
            .addTag('Products', 'Product catalog endpoints - Browse and search products')
            .addTag('Cart', 'Shopping cart endpoints - Manage cart items')
            .addTag('Checkout', 'Checkout endpoints - Complete orders')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(nestApp, config);
        swagger_1.SwaggerModule.setup('api', nestApp, document, {
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
        cachedServer = (0, serverless_express_1.default)({ app: expressApp });
    }
    return cachedServer;
}
const handler = async (event, context) => {
    console.log('📨 Received event:', event.httpMethod, event.path);
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const server = await bootstrap();
        return server(event, context, () => { });
    }
    catch (error) {
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
exports.handler = handler;
//# sourceMappingURL=lambda.js.map