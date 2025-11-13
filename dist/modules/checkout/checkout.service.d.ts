import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class CheckoutService {
    private readonly ctService;
    private readonly logger;
    constructor(ctService: CommercetoolsService);
    setShippingAddress(cartId: string, addressDto: SetAddressDto): Promise<import("@commercetools/platform-sdk").Cart>;
    setBillingAddress(cartId: string, addressDto: SetAddressDto): Promise<import("@commercetools/platform-sdk").Cart>;
    setShippingMethod(cartId: string, shippingMethodId: string, version: number): Promise<import("@commercetools/platform-sdk").Cart>;
    createOrder(createOrderDto: CreateOrderDto): Promise<import("@commercetools/platform-sdk").Order>;
    getOrderById(orderId: string): Promise<import("@commercetools/platform-sdk").Order>;
}
