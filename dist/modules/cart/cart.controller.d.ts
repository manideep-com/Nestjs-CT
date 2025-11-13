import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    createCart(createCartDto: CreateCartDto): Promise<import("@commercetools/platform-sdk").Cart>;
    getCartById(id: string): Promise<import("@commercetools/platform-sdk").Cart>;
    addLineItem(id: string, addLineItemDto: AddLineItemDto): Promise<import("@commercetools/platform-sdk").Cart>;
    removeLineItem(id: string, lineItemId: string, version: number): Promise<import("@commercetools/platform-sdk").Cart>;
    updateLineItemQuantity(id: string, updateDto: UpdateLineItemDto): Promise<import("@commercetools/platform-sdk").Cart>;
    applyDiscountCode(id: string, body: {
        code: string;
        version: number;
    }): Promise<import("@commercetools/platform-sdk").Cart>;
}
