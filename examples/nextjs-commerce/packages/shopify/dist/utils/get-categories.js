import { normalizeCategory } from './normalize';
import getSiteCollectionsQuery from './queries/get-all-collections-query';
const getCategories = async ({ fetch , locale  })=>{
    var ref, ref1;
    const { data  } = await fetch(getSiteCollectionsQuery, {
        variables: {
            first: 250
        }
    }, {
        ...locale && {
            headers: {
                'Accept-Language': locale
            }
        }
    });
    return ((ref = data.collections) === null || ref === void 0 ? void 0 : (ref1 = ref.edges) === null || ref1 === void 0 ? void 0 : ref1.map(({ node  })=>normalizeCategory(node)
    )) ?? [];
};
export default getCategories;
