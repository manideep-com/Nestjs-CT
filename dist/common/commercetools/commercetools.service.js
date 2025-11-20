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
        const authUrl = this.configService.get('CTP_AUTH_URL');
        const apiUrl = this.configService.get('CTP_API_URL');
        const clientId = this.configService.get('CTP_ADMIN_CLIENT_ID');
        const clientSecret = this.configService.get('CTP_ADMIN_CLIENT_SECRET');
        const scopes = this.configService.get('CTP_ADMIN_SCOPES');
        if (!projectKey || !authUrl || !apiUrl || !clientId || !clientSecret || !scopes) {
            throw new Error('Missing required Commercetools configuration. Please check your .env file.');
        }
        this.projectKey = projectKey;
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