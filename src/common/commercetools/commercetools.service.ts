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
  if (!projectKey) throw new Error('CTP_PROJECT_KEY is not set');
  this.projectKey = projectKey;
    
    const authUrl = this.configService.get<string>('CTP_AUTH_URL');
    if (!authUrl) throw new Error('CTP_AUTH_URL is not set');
    const clientId = this.configService.get<string>('CTP_CLIENT_ID');
    if (!clientId) throw new Error('CTP_CLIENT_ID is not set');
    const clientSecret = this.configService.get<string>('CTP_CLIENT_SECRET');
    if (!clientSecret) throw new Error('CTP_CLIENT_SECRET is not set');
    const scopes = this.configService.get<string>('CTP_SCOPES');
    if (!scopes) throw new Error('CTP_SCOPES is not set');
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

    const apiUrl = this.configService.get<string>('CTP_API_URL');
    if (!apiUrl) throw new Error('CTP_API_URLis not set');
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
    // Always return the project-scoped API root for chaining
    return this.apiRoot.withProjectKey({ projectKey: this.projectKey });
  }
}