import { CommercetoolsService } from '../commercetools/commercetools.service';
import { ConfigService } from '@nestjs/config';
export interface GuestTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    anonymous_id?: string;
}
export declare class AuthService {
    private readonly ctService;
    private readonly configService;
    private readonly logger;
    private tokenCache;
    constructor(ctService: CommercetoolsService, configService: ConfigService);
    createGuestToken(): Promise<GuestTokenResponse>;
    verifyToken(token: string): Promise<boolean>;
    refreshGuestToken(oldToken: string): Promise<GuestTokenResponse>;
    clearExpiredTokens(): void;
}
