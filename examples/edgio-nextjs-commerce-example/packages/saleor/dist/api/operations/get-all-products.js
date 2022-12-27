import { normalizeProduct } from '../../utils';
import * as Query from '../../utils/queries';
export default function getAllProductsOperation({ commerce  }) {
    async function getAllProducts({ query =Query.ProductMany , variables , config , featured  } = {}) {
        const { fetch , locale  } = commerce.getConfig(config);
        if (featured) {
            variables = {
                ...variables,
                categoryId: 'Q29sbGVjdGlvbjo0'
            };
            query = Query.CollectionOne;
        }
        const { data  } = await fetch(query, {
            variables
        }, {
            ...locale && {
                headers: {
                    'Accept-Language': locale
                }
            }
        });
        if (featured) {
            var ref, ref1;
            const products = ((ref = data.collection.products) === null || ref === void 0 ? void 0 : (ref1 = ref.edges) === null || ref1 === void 0 ? void 0 : ref1.map(({ node: p  })=>normalizeProduct(p)
            )) ?? [];
            return {
                products
            };
        } else {
            var ref2, ref3;
            const products = ((ref2 = data.products) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.edges) === null || ref3 === void 0 ? void 0 : ref3.map(({ node: p  })=>normalizeProduct(p)
            )) ?? [];
            return {
                products
            };
        }
    }
    return getAllProducts;
};
