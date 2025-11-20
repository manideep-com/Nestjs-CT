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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createGuestToken() {
        const tokenData = await this.authService.createGuestToken();
        return {
            success: true,
            message: 'Guest token created successfully',
            data: {
                token: tokenData.access_token,
                tokenType: tokenData.token_type,
                expiresIn: tokenData.expires_in,
                scope: tokenData.scope,
            },
        };
    }
    async verifyToken(req) {
        return {
            success: true,
            message: 'Token is valid',
            data: {
                token: req.token?.substring(0, 20) + '...',
            },
        };
    }
    async refreshToken(req) {
        const oldToken = req.token;
        const newTokenData = await this.authService.refreshGuestToken(oldToken);
        return {
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newTokenData.access_token,
                tokenType: newTokenData.token_type,
                expiresIn: newTokenData.expires_in,
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('guest-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create guest token',
        description: 'Generate an anonymous guest token for unauthenticated users. This token allows browsing products and managing cart without user registration.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Guest token created successfully',
        schema: {
            example: {
                success: true,
                message: 'Guest token created successfully',
                data: {
                    token: 'NW35rfPFRpR9gM41SyvqOItmxWMZxdHo',
                    tokenType: 'Bearer',
                    expiresIn: 172800,
                    scope: 'view_products:n8n-ct-integration manage_my_profile:n8n-ct-integration manage_my_orders:n8n-ct-integration'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Failed to create guest token' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createGuestToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('verify'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify token',
        description: 'Check if the provided Bearer token is valid and not expired. Requires Authorization header with Bearer token.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token is valid',
        schema: {
            example: {
                success: true,
                message: 'Token is valid',
                data: {
                    token: 'NW35rfPFRpR9gM41Sy...'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
        schema: {
            example: {
                statusCode: 401,
                timestamp: '2025-11-19T07:49:07.869Z',
                path: '/auth/verify',
                message: 'Authorization header is required'
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh token',
        description: 'Generate a new guest token and invalidate the old one. Requires valid Bearer token in Authorization header.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token: 'NewTokenHere123456',
                    tokenType: 'Bearer',
                    expiresIn: 172800
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid token' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map