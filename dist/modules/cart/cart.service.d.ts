import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
export declare class CartService {
    private readonly ctService;
    private readonly logger;
    constructor(ctService: CommercetoolsService);
    createCart(createCartDto: CreateCartDto): Promise<import("@commercetools/platform-sdk").Cart>;
    getCartById(id: string): Promise<import("@commercetools/platform-sdk").Cart>;
    addLineItem(cartId: string, addLineItemDto: AddLineItemDto): Promise<import("@commercetools/platform-sdk").Cart>;
    removeLineItem(cartId: string, lineItemId: string, version: number): Promise<import("@commercetools/platform-sdk").Cart>;
    updateLineItemQuantity(cartId: string, updateDto: UpdateLineItemDto): Promise<import("@commercetools/platform-sdk").Cart>;
    applyDiscountCode(cartId: string, code: string, version: number): Promise<import("@commercetools/platform-sdk").Cart>;
}
