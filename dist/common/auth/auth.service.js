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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const commercetools_service_1 = require("../commercetools/commercetools.service");
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(ctService, configService) {
        this.ctService = ctService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.tokenCache = new Map();
    }
    async createGuestToken() {
        try {
            const authUrl = this.configService.get('CTP_AUTH_URL');
            const projectKey = this.configService.get('CTP_PROJECT_KEY');
            const clientId = this.configService.get('CTP_GUEST_CLIENT_ID');
            const clientSecret = this.configService.get('CTP_GUEST_CLIENT_SECRET');
            const scopes = this.configService.get('CTP_GUEST_SCOPES');
            this.logger.log(`Creating guest token for project: ${projectKey}`);
            this.logger.log(`Using scopes: ${scopes}`);
            const tokenUrl = `${authUrl}/oauth/token`;
            const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            const formData = new URLSearchParams({
                grant_type: 'client_credentials',
                scope: scopes || `manage_project:${projectKey}`,
            });
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`,
                },
                body: formData.toString(),
            });
            const responseText = await response.text();
            if (!response.ok) {
                this.logger.error(`Auth failed: ${response.status} ${response.statusText}`);
                this.logger.error(`Response: ${responseText}`);
                throw new common_1.BadRequestException(`Authentication failed: ${responseText}`);
            }
            const tokenData = JSON.parse(responseText);
            this.tokenCache.set(tokenData.access_token, {
                expires: Date.now() + tokenData.expires_in * 1000,
            });
            this.logger.log(`✅ Guest token created successfully`);
            this.logger.log(`Scope: ${tokenData.scope}`);
            this.logger.log(`Expires in: ${tokenData.expires_in} seconds`);
            return tokenData;
        }
        catch (error) {
            this.logger.error('❌ Token creation failed', error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create guest token');
        }
    }
    async verifyToken(token) {
        try {
            const cached = this.tokenCache.get(token);
            if (cached) {
                if (Date.now() < cached.expires) {
                    return true;
                }
                else {
                    this.tokenCache.delete(token);
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            this.logger.error('Token verification failed', error);
            return false;
        }
    }
    async refreshGuestToken(oldToken) {
        this.logger.log('Refreshing guest token');
        this.tokenCache.delete(oldToken);
        return this.createGuestToken();
    }
    clearExpiredTokens() {
        const now = Date.now();
        for (const [token, data] of this.tokenCache.entries()) {
            if (now >= data.expires) {
                this.tokenCache.delete(token);
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commercetools_service_1.CommercetoolsService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map