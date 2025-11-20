import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CommercetoolsService } from '../commercetools/commercetools.service';
import { ConfigService } from '@nestjs/config';

export interface GuestTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  anonymous_id?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private tokenCache = new Map<string, { expires: number }>();

  constructor(
    private readonly ctService: CommercetoolsService,
    private readonly configService: ConfigService,
  ) {}

  async createGuestToken(): Promise<GuestTokenResponse> {
    try {
      const authUrl = this.configService.get<string>('CTP_AUTH_URL');
      const projectKey = this.configService.get<string>('CTP_PROJECT_KEY');
      const clientId = this.configService.get<string>('CTP_GUEST_CLIENT_ID');
      const clientSecret = this.configService.get<string>('CTP_GUEST_CLIENT_SECRET');
      const scopes = this.configService.get<string>('CTP_GUEST_SCOPES');

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
        throw new BadRequestException(`Authentication failed: ${responseText}`);
      }

      const tokenData: GuestTokenResponse = JSON.parse(responseText);

    
      this.tokenCache.set(tokenData.access_token, {
        expires: Date.now() + tokenData.expires_in * 1000,
      });

      this.logger.log(`✅ Guest token created successfully`);
      this.logger.log(`Scope: ${tokenData.scope}`);
      this.logger.log(`Expires in: ${tokenData.expires_in} seconds`);

      return tokenData;
    } catch (error) {
      this.logger.error('❌ Token creation failed', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create guest token');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
    
      const cached = this.tokenCache.get(token);
      if (cached) {
        if (Date.now() < cached.expires) {
          return true;
        } else {
          this.tokenCache.delete(token);
          return false;
        }
      }

      
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      return false;
    }
  }

  async refreshGuestToken(oldToken: string): Promise<GuestTokenResponse> {
    this.logger.log('Refreshing guest token');
    this.tokenCache.delete(oldToken);
    return this.createGuestToken();
  }

  clearExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of this.tokenCache.entries()) {
      if (now >= data.expires) {
        this.tokenCache.delete(token);
      }
    }
  }
}