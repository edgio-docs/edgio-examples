import { useMemo } from 'react';
import useCart from '@vercel/commerce/cart/use-cart';
export default useCart;
export const handler = {
    fetchOptions: {
        url: '/api/cart',
        method: 'GET'
    },
    useHook: ({ useData  })=>{
        return function useHook(input) {
            const response = useData({
                swrOptions: {
                    revalidateOnFocus: false,
                    ...input === null || input === void 0 ? void 0 : input.swrOptions
                }
            });
            return useMemo(()=>{
                return Object.create(response, {
                    isEmpty: {
                        get () {
                            var ref, ref1;
                            return (((ref = response.data) === null || ref === void 0 ? void 0 : (ref1 = ref.lineItems) === null || ref1 === void 0 ? void 0 : ref1.length) ?? 0) <= 0;
                        },
                        enumerable: true
                    }
                });
            }, [
                response
            ]);
        };
    }
};
