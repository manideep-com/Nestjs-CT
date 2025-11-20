import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createGuestToken(): Promise<{
        success: boolean;
        message: string;
        data: {
            token: string;
            tokenType: string;
            expiresIn: number;
            scope: string;
        };
    }>;
    verifyToken(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            token: string;
        };
    }>;
    refreshToken(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            token: string;
            tokenType: string;
            expiresIn: number;
        };
    }>;
}
