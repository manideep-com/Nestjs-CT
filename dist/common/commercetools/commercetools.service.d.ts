import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
export declare class CommercetoolsService implements OnModuleInit {
    private configService;
    private apiRoot;
    private projectKey;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getApiRoot(): ByProjectKeyRequestBuilder;
}
