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
var AuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthGuard = AuthGuard_1 = class AuthGuard {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(AuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            this.logger.warn('No authorization header provided');
            throw new common_1.UnauthorizedException('Authorization header is required');
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer') {
            this.logger.warn('Invalid authorization type');
            throw new common_1.UnauthorizedException('Authorization type must be Bearer');
        }
        if (!token) {
            this.logger.warn('No token provided');
            throw new common_1.UnauthorizedException('Token is required');
        }
        try {
            const isValid = await this.authService.verifyToken(token);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
            request.token = token;
            return true;
        }
        catch (error) {
            this.logger.error('Token verification failed', error);
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = AuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map