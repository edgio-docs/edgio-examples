import { useHook, useMutationHook } from '../../utils/use-hook';
import { mutationFetcher } from '../../utils/default-fetcher';
export const fetcher = mutationFetcher;
const fn = (provider)=>{
    var ref, ref1;
    return provider === null || provider === void 0 ? void 0 : (ref = provider.customer) === null || ref === void 0 ? void 0 : (ref1 = ref.card) === null || ref1 === void 0 ? void 0 : ref1.useUpdateItem;
};
const useUpdateItem = (input)=>{
    const hook = useHook(fn);
    return useMutationHook({
        fetcher,
        ...hook
    })(input);
};
export default useUpdateItem;
