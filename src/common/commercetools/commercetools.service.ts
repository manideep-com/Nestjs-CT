import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {
  createApiBuilderFromCtpClient,
  type ApiRoot,
  ByProjectKeyRequestBuilder,
} from '@commercetools/platform-sdk';

@Injectable()
export class CommercetoolsService implements OnModuleInit {
  private apiRoot!: ApiRoot;
  private projectKey!: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectKey = this.configService.get<string>('CTP_PROJECT_KEY');
    const authUrl = this.configService.get<string>('CTP_AUTH_URL');
    const apiUrl = this.configService.get<string>('CTP_API_URL');
    const clientId = this.configService.get<string>('CTP_ADMIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>('CTP_ADMIN_CLIENT_SECRET');
    const scopes = this.configService.get<string>('CTP_ADMIN_SCOPES');

    if (!projectKey || !authUrl || !apiUrl || !clientId || !clientSecret || !scopes) {
      throw new Error(
        'Missing required Commercetools configuration. Please check your .env file.'
      );
    }

    this.projectKey = projectKey;

    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: authUrl,
      projectKey: this.projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: [scopes],
      fetch,
    };

    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: apiUrl,
      fetch,
    };

    const client = new ClientBuilder()
      .withProjectKey(this.projectKey)
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();

    this.apiRoot = createApiBuilderFromCtpClient(client);
  }

  getApiRoot(): ByProjectKeyRequestBuilder {
    return this.apiRoot.withProjectKey({ projectKey: this.projectKey });
  }
}