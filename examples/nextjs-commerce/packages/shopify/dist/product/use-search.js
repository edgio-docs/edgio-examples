import useSearch from '@vercel/commerce/product/use-search';
import { getAllProductsQuery, getCollectionProductsQuery, getSearchVariables, normalizeProduct } from '../utils';
export default useSearch;
export const handler = {
    fetchOptions: {
        query: getAllProductsQuery
    },
    async fetcher ({ input , options , fetch  }) {
        const { categoryId , brandId  } = input;
        const method = options === null || options === void 0 ? void 0 : options.method;
        const variables = getSearchVariables(input);
        let products;
        // change the query to getCollectionProductsQuery when categoryId is set
        if (categoryId) {
            var ref, ref1, ref2, ref3, ref4;
            const data = await fetch({
                query: getCollectionProductsQuery,
                method,
                variables
            });
            // filter on client when brandId & categoryId are set since is not available on collection product query
            products = brandId ? (ref = data.node) === null || ref === void 0 ? void 0 : (ref1 = ref.products) === null || ref1 === void 0 ? void 0 : (ref2 = ref1.edges) === null || ref2 === void 0 ? void 0 : ref2.filter(({ node: { vendor  }  })=>vendor.replace(/\s+/g, '-').toLowerCase() === brandId
            ) : (ref3 = data.node) === null || ref3 === void 0 ? void 0 : (ref4 = ref3.products) === null || ref4 === void 0 ? void 0 : ref4.edges;
        } else {
            var ref5;
            const data = await fetch({
                query: options.query,
                method,
                variables
            });
            products = (ref5 = data.products) === null || ref5 === void 0 ? void 0 : ref5.edges;
        }
        return {
            products: products === null || products === void 0 ? void 0 : products.map(({ node  })=>normalizeProduct(node)
            ),
            found: !!(products === null || products === void 0 ? void 0 : products.length)
        };
    },
    useHook: ({ useData  })=>(input = {})=>{
            return useData({
                input: [
                    [
                        'search',
                        input.search
                    ],
                    [
                        'categoryId',
                        input.categoryId
                    ],
                    [
                        'brandId',
                        input.brandId
                    ],
                    [
                        'sort',
                        input.sort
                    ],
                    [
                        'locale',
                        input.locale
                    ], 
                ],
                swrOptions: {
                    revalidateOnFocus: false,
                    ...input.swrOptions
                }
            });
        }
};
