import { normalizeTestCheckout } from '../../../utils/normalize-checkout';
const submitCheckout = async ({ res , body: { item , cartId  } , config: { sdkFetch  } ,  })=>{
    var ref;
    const sdkFetcher = sdkFetch;
    // Generate a checkout token
    const { id: checkoutToken  } = await sdkFetcher('checkout', 'generateTokenFrom', 'cart', cartId);
    const shippingMethods = await sdkFetcher('checkout', 'getShippingOptions', checkoutToken, {
        country: 'US'
    });
    const shippingMethodToUse = (shippingMethods === null || shippingMethods === void 0 ? void 0 : (ref = shippingMethods[0]) === null || ref === void 0 ? void 0 : ref.id) || '';
    const checkoutData = normalizeTestCheckout({
        paymentInfo: item === null || item === void 0 ? void 0 : item.card,
        shippingInfo: item === null || item === void 0 ? void 0 : item.address,
        shippingOption: shippingMethodToUse
    });
    // Capture the order
    await sdkFetcher('checkout', 'capture', checkoutToken, checkoutData);
    res.status(200).json({
        data: null,
        errors: []
    });
};
export default submitCheckout;
