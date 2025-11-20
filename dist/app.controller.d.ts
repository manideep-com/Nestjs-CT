export declare class AppController {
    getRoot(): {
        message: string;
        version: string;
        endpoints: {
            swagger: string;
            health: string;
            auth: string;
            products: string;
            cart: string;
            checkout: string;
        };
        timestamp: string;
    };
    getHealth(): {
        status: string;
        timestamp: string;
        environment: string;
    };
}
