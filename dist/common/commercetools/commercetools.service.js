"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommercetoolsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_client_v2_1 = require("@commercetools/sdk-client-v2");
const platform_sdk_1 = require("@commercetools/platform-sdk");
let CommercetoolsService = class CommercetoolsService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const projectKey = this.configService.get('CTP_PROJECT_KEY');
        if (!projectKey)
            throw new Error('CTP_PROJECT_KEY is not set');
        this.projectKey = projectKey;
        const authUrl = this.configService.get('CTP_AUTH_URL');
        if (!authUrl)
            throw new Error('CTP_AUTH_URL is not set');
        const clientId = this.configService.get('CTP_CLIENT_ID');
        if (!clientId)
            throw new Error('CTP_CLIENT_ID is not set');
        const clientSecret = this.configService.get('CTP_CLIENT_SECRET');
        if (!clientSecret)
            throw new Error('CTP_CLIENT_SECRET is not set');
        const scopes = this.configService.get('CTP_SCOPES');
        if (!scopes)
            throw new Error('CTP_SCOPES is not set');
        const authMiddlewareOptions = {
            host: authUrl,
            projectKey: this.projectKey,
            credentials: {
                clientId,
                clientSecret,
            },
            scopes: [scopes],
            fetch,
        };
        const apiUrl = this.configService.get('CTP_API_URL');
        if (!apiUrl)
            throw new Error('CTP_API_URLis not set');
        const httpMiddlewareOptions = {
            host: apiUrl,
            fetch,
        };
        const client = new sdk_client_v2_1.ClientBuilder()
            .withProjectKey(this.projectKey)
            .withClientCredentialsFlow(authMiddlewareOptions)
            .withHttpMiddleware(httpMiddlewareOptions)
            .withLoggerMiddleware()
            .build();
        this.apiRoot = (0, platform_sdk_1.createApiBuilderFromCtpClient)(client);
    }
    getApiRoot() {
        return this.apiRoot.withProjectKey({ projectKey: this.projectKey });
    }
};
exports.CommercetoolsService = CommercetoolsService;
exports.CommercetoolsService = CommercetoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CommercetoolsService);
//# sourceMappingURL=commercetools.service.js.map