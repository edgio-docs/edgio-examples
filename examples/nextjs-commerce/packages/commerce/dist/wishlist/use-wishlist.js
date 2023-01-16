import { useHook, useSWRHook } from '../utils/use-hook';
import { SWRFetcher } from '../utils/default-fetcher';
export const fetcher = SWRFetcher;
const fn = (provider)=>{
    var ref;
    return (ref = provider.wishlist) === null || ref === void 0 ? void 0 : ref.useWishlist;
};
const useWishlist = (...args)=>{
    const hook = useHook(fn);
    return useSWRHook({
        fetcher,
        ...hook
    })(...args);
};
export default useWishlist;
