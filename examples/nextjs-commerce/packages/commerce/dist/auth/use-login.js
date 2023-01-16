import { useHook, useMutationHook } from '../utils/use-hook';
import { mutationFetcher } from '../utils/default-fetcher';
export const fetcher = mutationFetcher;
const fn = (provider)=>{
    var ref;
    return (ref = provider.auth) === null || ref === void 0 ? void 0 : ref.useLogin;
};
const useLogin = (...args)=>{
    const hook = useHook(fn);
    return useMutationHook({
        fetcher,
        ...hook
    })(...args);
};
export default useLogin;
