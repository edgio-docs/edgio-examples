import { CommerceError } from '@vercel/commerce/utils/errors';
import { normalizeCart } from './normalize';
import throwUserErrors from './throw-user-errors';
const checkoutToCart = (checkoutPayload)=>{
    throwUserErrors(checkoutPayload === null || checkoutPayload === void 0 ? void 0 : checkoutPayload.checkoutUserErrors);
    if (!(checkoutPayload === null || checkoutPayload === void 0 ? void 0 : checkoutPayload.checkout)) {
        throw new CommerceError({
            message: 'Missing checkout object from response'
        });
    }
    return normalizeCart(checkoutPayload === null || checkoutPayload === void 0 ? void 0 : checkoutPayload.checkout);
};
export default checkoutToCart;
