import { CheckoutService } from './checkout.service';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    setShippingAddress(id: string, addressDto: SetAddressDto): Promise<import("@commercetools/platform-sdk").Cart>;
    setBillingAddress(id: string, addressDto: SetAddressDto): Promise<import("@commercetools/platform-sdk").Cart>;
    getShippingMethods(id: string): Promise<import("@commercetools/platform-sdk").ShippingMethodPagedQueryResponse>;
    setShippingMethod(id: string, body: {
        shippingMethodId: string;
        version: number;
    }): Promise<import("@commercetools/platform-sdk").Cart>;
    createOrder(createOrderDto: CreateOrderDto): Promise<import("@commercetools/platform-sdk").Order>;
    getOrderById(id: string): Promise<import("@commercetools/platform-sdk").Order>;
}
